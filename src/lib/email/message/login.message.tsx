import { render } from "@react-email/render";
import { Button, Section, Text } from "@react-email/components";
import { EmailTemplate, styles } from "./template";
import { VerificationEmailMessage } from "./email.message";

export class LoginMessage extends VerificationEmailMessage {
  getMaxAge(): number {
    return 10 * 60; // 10 minutes
  }
  getSubject() {
    return `Login to Bloggo`;
  }
  getText() {
    return `Login to Bloggo\n${this.options.url}\n\n`;
  }
  async getHtml() {
    return await render(
      <EmailTemplate
        heading="Your login link for Bloggo"
        options={this.options}
      >
        <Section style={buttonContainer}>
          <Button style={styles.button} href={this.options.url}>
            Click here to log in
          </Button>
        </Section>
        {this.options.validationCode ? (
          <>
            <Text style={styles.paragraph}>
              This link and code will only be valid for the next{" "}
              {this.getMaxAge() / 60}
              minutes. If the link does not work, you can use the login
              verification code directly:
            </Text>
            <code style={code}>{this.options.validationCode}</code>
          </>
        ) : (
          <Text style={styles.paragraph}>
            This link will only be valid for the next {this.getMaxAge() / 60}{" "}
            minutes. <br />
            If you did not request this email you can safely ignore it.
          </Text>
        )}
      </EmailTemplate>
    );
  }
}

const buttonContainer = {
  padding: "16px 0 24px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};
