data "aws_ami" "ubuntu" {
  most_recent = true

  owners = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "app" {
  count = 2

  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  subnet_id                   = count.index == 0 ? aws_subnet.public[0].id : aws_subnet.private[1].id
  associate_public_ip_address = count.index == 0

  vpc_security_group_ids = [aws_security_group.app.id]

  key_name             = var.key_name
  iam_instance_profile = aws_iam_instance_profile.ec2.name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y docker.io
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "${var.project_name}-app-${count.index + 1}"
  }
}