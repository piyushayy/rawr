export default function TermsPage() {
  return (
    <article>
      <h1>Terms of Service</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Agreement to Terms</h2>
      <p>
        By accessing our website, you agree to be bound by these Terms of
        Service and to comply with all applicable laws and regulations.
      </p>

      <h2>2. Intellectual Property</h2>
      <p>
        The content, organization, graphics, design, compilation, magnetic
        translation, digital conversion and other matters related to the Site
        are protected under applicable copyrights, trademarks and other
        proprietary (including but not limited to intellectual property) rights.
      </p>

      <h2>3. Purchases</h2>
      <p>
        If you wish to purchase any product or service made available through
        the Service ("Purchase"), you may be asked to supply certain information
        relevant to your Purchase including, without limitation, your credit
        card number, the expiration date of your credit card, your billing
        address, and your shipping information.
      </p>

      <h2>4. Limitation of Liability</h2>
      <p>
        In no event shall RAWR STREAMWARE, nor its directors, employees,
        partners, agents, suppliers, or affiliates, be liable for any indirect,
        incidental, special, consequential or punitive damages.
      </p>
    </article>
  );
}
