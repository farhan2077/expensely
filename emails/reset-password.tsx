import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

import { BASE_URL, BRAND_COLOR, APP_NAME } from "@/config";

interface ResetPasswordEmailProps {
  userName: string;
  token: string;
}

export const ResetPasswordEmail = ({
  userName,
  token,
}: ResetPasswordEmailProps) => {
  const logoLink = `${BASE_URL}/static/logo.png`;
  const passwordResetLink = `${BASE_URL}/reset-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={logoLink} width="40" height="40" alt={APP_NAME} />
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            Someone recently requested a password change for your {APP_NAME}
            account. If this was you, you can set a new password here:
          </Text>
          <Button style={button} href={passwordResetLink}>
            Reset password
          </Button>
          <Text style={text}>
            If you didn&apos;t request this or don&apos;t want to change your
            password, just ignore this message.
          </Text>
          <Text style={text}>
            To keep your account secure, please don&apos;t forward this email to
            anyone. <b>This link will expire in 10 minutes.</b>
          </Text>
          <Text style={text}>— The {APP_NAME} Team</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

ResetPasswordEmail.PreviewProps = {
  userName: "Farhan",
  token: "test-token",
} as ResetPasswordEmailProps;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, Roboto, sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: BRAND_COLOR,
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Helvetica Neue', Arial, Roboto",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};
