import { render } from "@react-email/render";
import { Button, Section, Text } from "@react-email/components";
import { EmailTemplate, styles } from "./template";
import { VerificationEmailMessage } from "../email.message";

export class ResetPasswordMessage extends VerificationEmailMessage {
  getMaxAge(): number {
    return 10 * 60;
  }
  getSubject() {
    return `Reset your password`;
  }
  getText() {
    return `Reset you password at \n${this.options.url}\n\n`;
  }
  async getHtml() {
    return await render(
      <EmailTemplate heading="Password reset" options={this.options}>
        <Section style={buttonContainer}>
          <Button style={styles.button} href={this.options.url}>
            Click here to reset your password
          </Button>
        </Section>

        <Text style={styles.paragraph}>
          The link will be valid for the next {this.getMaxAge() / 60} minutes.
        </Text>
        <Text style={styles.paragraph}>
          If you don&apos;t want to change your password or didn&apos;t request
          this, just ignore and delete this message.
        </Text>
        <Text style={styles.paragraph}>
          To keep your account secure, please don&apos;t forward this email to
          anyone.
        </Text>
        <Text style={styles.paragraph}>Happy Blogging!</Text>
      </EmailTemplate>
    );
  }
}

const buttonContainer = {
  padding: "16px 0 24px",
};
