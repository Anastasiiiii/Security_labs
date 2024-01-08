<samlp:AuthnRequest
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="identifier_0"
    Version="2.0"
    IssueInstant="2024-01-08T12:00:00Z"
    Destination="https://kpi.eu.auth0.com/samlp/metadata"
    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
    AssertionConsumerServiceURL="https://example/callback">
  <saml:Issuer>https://kpi.eu.auth0.com</saml:Issuer>
  <samlp:NameIDPolicy
      Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"
      AllowCreate="true"/>
</samlp:AuthnRequest>
