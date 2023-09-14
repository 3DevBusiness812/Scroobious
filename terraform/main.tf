locals {
  prefix = "scroobious"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "default"
  region  = "us-west-2"
}

resource "aws_s3_bucket" "app_files" {
  bucket = "${local.prefix}-app-files-${var.environment}"
  acl    = "private"

  lifecycle_rule {
    id = "abort_incomplete_multipart_uploads"
    enabled = true
    abort_incomplete_multipart_upload_days = 7

    expiration {
      days = 60
    }
  }

  versioning {
    enabled = true
  }
}
