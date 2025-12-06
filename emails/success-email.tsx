import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Row,
  Column,
  Hr,
} from "@react-email/components";
import * as React from "react";

// Types needed for the component
interface BookingConfirmationProps {
  bookingTypeLabel?: string;
  bookingDateTime?: string;
  clientName?: string;
  clientPhone?: string;
  bookingType?: string;
  isStudentFlag?: boolean;
  totalCents?: number;
  depositCents?: number;
}

const BookingConfirmation = ({
  bookingTypeLabel = "Accompagnement Achat Véhicule",
  bookingDateTime = "Samedi 24 Octobre à 14:00",
  clientName = "Thomas Dupont",
  clientPhone = "06 12 34 56 78",
  bookingType = "accompagnement",
  isStudentFlag = false,
  totalCents = 15000,
  depositCents = 2000,
}: BookingConfirmationProps) => {
  const balanceCents = totalCents - depositCents;
  const formatPrice = (cents: number) => (cents / 100).toFixed(2) + " €";

  return (
    <Html>
      <Head />
      <Preview>Confirmation de rendez-vous : {bookingTypeLabel}</Preview>
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
                Bienvenue chez YassAuto ! 🚗
              </Heading>
              <Text className="text-blue-100 text-[14px] mt-2 mb-0 opacity-90">
                Merci pour votre confiance.
              </Text>
            </Section>

            {/* Content */}
            <Section className="px-6 py-4">
              <Text className="text-gray-600 text-[16px] text-center leading-[24px]">
                Votre rendez-vous a bien été enregistré. Voici le récapitulatif
                :
              </Text>

              {/* Data Table Wrapper */}
              <Section className="border border-solid border-gray-200 rounded-lg overflow-hidden mt-4">
                <Section className="bg-gray-50 p-3 border-b border-solid border-gray-200">
                  <Text className="m-0 font-semibold text-gray-700 text-sm">
                    Détails de la réservation
                  </Text>
                </Section>

                {/* Rows converted from Grid to Table Rows */}
                <InfoRow label="Type de service" value={bookingTypeLabel} />
                <InfoRow label="Date & Heure" value={bookingDateTime} />
                <InfoRow label="Votre nom" value={clientName} />
                <InfoRow
                  label="Téléphone"
                  value={clientPhone || "Non fourni"}
                />

                {/* Price Section */}
                {bookingType === "accompagnement" && (
                  <>
                    <InfoRow
                      label="Prix total"
                      isPrice
                      value={
                        <>
                          {formatPrice(totalCents)} TTC
                          {isStudentFlag && (
                            <span className="ml-2 inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              -30% Étudiant
                            </span>
                          )}
                        </>
                      }
                      highlight
                    />
                    <InfoRow
                      label="Acompte payé"
                      value={`${formatPrice(depositCents)} TTC`}
                      valueClassName="text-green-600"
                    />
                    <InfoRow
                      label="Reste à régler"
                      value={`${formatPrice(balanceCents)} TTC`}
                      valueClassName="font-bold text-brand-red"
                      highlight
                      bgClassName="bg-blue-50"
                    />
                  </>
                )}
              </Section>
            </Section>

            {/* Student Alert */}
            {isStudentFlag && (
              <Section className="px-6 pb-4">
                <Section className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
                  <Row>
                    {/* Replaced SVG with Emoji or Text for email safety */}
                    <Column className="w-[24px] align-top pr-3">
                      <Text className="text-[18px] m-0">⚠️</Text>
                    </Column>
                    <Column>
                      <Text className="text-sm font-medium text-amber-800 m-0 mb-1">
                        Vérification requise
                      </Text>
                      <Text className="text-sm text-amber-700 m-0 leading-[20px]">
                        Votre statut étudiant sera vérifié le jour du
                        rendez-vous. Merci de vous munir de votre carte
                        d'étudiant.
                      </Text>
                      <Text className="text-xs text-amber-700 mt-2 m-0 opacity-80">
                        En cas de non-présentation, le solde sera de{" "}
                        <strong>{formatPrice(15000 - depositCents)}</strong>.
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Section>
            )}

            <Hr className="border-gray-200 mx-6" />

            {/* Footer */}
            <Section className="text-center pt-4 pb-6 px-6">
              <Text className="text-gray-700 mb-2 font-medium text-[16px]">
                Contact : 06 48 38 05 68
              </Text>
              <Text className="text-gray-500 text-sm mt-0">
                Merci et à bientôt ! 👍
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// Helper Component for Table Rows
// Note: We use Section/Row/Column instead of CSS Grid
const InfoRow = ({
  label,
  value,
  valueClassName = "",
  bgClassName = "",
  highlight = false,
  isPrice = false,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  bgClassName?: string;
  highlight?: boolean;
  isPrice?: boolean;
}) => (
  <Section
    className={`border-b border-gray-100 ${
      highlight ? bgClassName || "bg-gray-50" : ""
    }`}
  >
    <Row className="p-3">
      <Column className="w-1/3 p-3 align-top">
        <Text className="m-0 text-gray-500 font-medium text-sm">{label}</Text>
      </Column>
      <Column className="p-3 align-top">
        <Text className={`m-0 text-gray-900 font-medium ${valueClassName}`}>
          {value}
        </Text>
      </Column>
    </Row>
  </Section>
);

export default BookingConfirmation;
