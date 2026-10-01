resource "aws_iam_role" "jenkins" {
  name = "${var.project_name}-jenkins-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "jenkins_ssm" {
  role       = aws_iam_role.jenkins.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "jenkins" {
  name = "${var.project_name}-jenkins-profile"
  role = aws_iam_role.jenkins.name
}

resource "aws_instance" "jenkins" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.small"

  subnet_id                   = aws_subnet.public[0].id
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.jenkins.id]

  key_name             = var.key_name
  iam_instance_profile = aws_iam_instance_profile.jenkins.name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = <<-EOF
  #!/bin/bash
  set -e

  apt-get update
  apt-get install -y fontconfig openjdk-21-jre docker.io unzip curl git wget

  systemctl enable docker
  systemctl start docker

  usermod -aG docker ubuntu

  mkdir -p /etc/apt/keyrings

  wget -O /etc/apt/keyrings/jenkins-keyring.asc \
    https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

  echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" \
    > /etc/apt/sources.list.d/jenkins.list

  apt-get update
  apt-get install -y jenkins

  usermod -aG docker jenkins

  systemctl enable jenkins
  systemctl start jenkins
EOF
  tags = {
    Name = "${var.project_name}-jenkins"
  }
}
resource "aws_iam_role_policy" "jenkins_deploy" {
  name = "${var.project_name}-jenkins-deploy"
  role = aws_iam_role.jenkins.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "ssm:DescribeInstanceInformation",
          "ssm:SendCommand",
          "ssm:GetCommandInvocation",
          "ssm:ListCommandInvocations",
          "ssm:ListCommands"
        ]

        Resource = "*"
      }
    ]
  })
}