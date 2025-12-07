import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

const AdminEmail = ({
  message,
  subject,
}: {
  message: string;
  subject: string;
}) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                "brand-red": "#DC2626", // Fixed typo in key name
                "brand-dark": "#18181B",
                "brand-black": "#09090B",
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 font-sans my-auto mx-auto px-2">
          <Container className="border border-solid border-gray-200 rounded my-[40px] mx-auto p-[20px] max-w-[568px] bg-white">
            {/* Header */}
            <Section className="bg-brand-red rounded-t-md text-center p-6">
              <Heading className="text-white text-[24px] font-bold p-0 my-0 mx-auto">
                {subject}
              </Heading>
            </Section>
            {/* Content */}
            <Section className="px-6 py-4">
              {/* Data Table Wrapper */}
              <Section className="border border-solid border-gray-200 rounded-lg overflow-hidden mt-4">
                <Section className="bg-gray-50 p-3 border-b border-solid border-gray-200">
                  <Text className="m-0 font-semibold text-gray-700 text-sm">
                    Détails
                  </Text>
                </Section>
                <Text
                  className="text-gray-600 text-[16px] text-left leading-[24px]"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {message}
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default AdminEmail;
