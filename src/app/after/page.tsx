import type { Metadata } from "next";
import AfterContent from "./AfterContent";

export const metadata: Metadata = {
  title: "Les photos — Fiona & Antoine",
  description:
    "Retrouvez et déposez les photos du mariage. Bientôt disponible — pour le moment, éclatez-vous !",
};

export default function AfterPage() {
  return <AfterContent />;
}
