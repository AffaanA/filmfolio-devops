resource "aws_lb" "app" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = aws_subnet.public[*].id

  tags = {
    Name = "${var.project_name}-alb"
  }
}

# -------------------------
# Frontend Target Group
# -------------------------

resource "aws_lb_target_group" "frontend" {
  name     = "${var.project_name}-frontend-tg"
  port     = 3000
  protocol = "HTTP"

  vpc_id = aws_vpc.main.id

  health_check {
    enabled  = true
    path     = "/"
    protocol = "HTTP"
    port     = "3000"

    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
  }

  tags = {
    Name = "${var.project_name}-frontend-tg"
  }
}

resource "aws_lb_target_group_attachment" "frontend" {
  count = 2

  target_group_arn = aws_lb_target_group.frontend.arn
  target_id        = aws_instance.app[count.index].id
  port             = 3000
}

# -------------------------
# Backend Target Group
# -------------------------

resource "aws_lb_target_group" "backend" {
  name     = "${var.project_name}-backend-tg"
  port     = 5000
  protocol = "HTTP"

  vpc_id = aws_vpc.main.id

  health_check {
    enabled  = true
    path     = "/health"
    protocol = "HTTP"
    port     = "5000"

    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
  }

  tags = {
    Name = "${var.project_name}-backend-tg"
  }
}

resource "aws_lb_target_group_attachment" "backend" {
  count = 2

  target_group_arn = aws_lb_target_group.backend.arn
  target_id        = aws_instance.app[count.index].id
  port             = 5000
}

# -------------------------
# ALB Listener
# -------------------------

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  lifecycle {
    create_before_destroy = true
  }

  default_action {
    type = "forward"

    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# -------------------------
# Backend Path Routing
# -------------------------

resource "aws_lb_listener_rule" "backend" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  condition {
    path_pattern {
      values = [
        "/login/*",
        "/signup/*",
        "/logout/*",
        "/stream/*",
        "/upload/*"
      ]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

resource "aws_lb_listener_rule" "backend_watchlist" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 101

  condition {
    path_pattern {
      values = [
        "/addwatchlist/*"
      ]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}