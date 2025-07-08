import { render } from "@react-email/render";
import { Button, Section, Text } from "@react-email/components";
import { EmailTemplate, styles } from "./template";
import { VerificationEmailMessage } from "./email.message";

export class VerifyEmailMessage extends VerificationEmailMessage {
  getMaxAge(): number {
    return 60 * 60 * 24; // 24 hours
  }
  getSubject() {
    return `Welcome to Bloggo!`;
  }
  getText() {
    return `Verify your email address \n${this.options.url}\n\n`;
  }
  async getHtml() {
    return await render(
      <EmailTemplate heading="Welcome to Bloggo" options={this.options}>
        <Section style={buttonContainer}>
          <Button style={styles.button} href={this.options.url}>
            Click here to verify your email
          </Button>
        </Section>
        <Text style={styles.paragraph}>Happy Blogging!</Text>
      </EmailTemplate>
    );
  }
}

const buttonContainer = {
  padding: "16px 0 24px",
};
