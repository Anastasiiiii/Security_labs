<samlp:Response
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="identifier_1"
    Version="2.0"
    IssueInstant="2024-01-08T12:05:00Z"
    Destination="https://example/callback"
    InResponseTo="identifier_1234">
  <saml:Issuer>https://kpi.eu.auth0.com</saml:Issuer>
  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
  </samlp:Status>
  <saml:Assertion
      ID="identifier_91011"
      IssueInstant="2024-01-08T12:05:00Z">
    <saml:Issuer>https://kpi.eu.auth0.com</saml:Issuer>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">nastia262002@gmail.com</saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData NotOnOrAfter="2024-01-08T12:15:00Z"/>
      </saml:SubjectConfirmation>
    </saml:Subject>
    <saml:AttributeStatement>
      <saml:Attribute Name="exam_book_number" Format="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml:AttributeValue>0426</saml:AttributeValue>
      </saml:Attribute>
    </saml:AttributeStatement>
  </saml:Assertion>
</samlp:Response>
