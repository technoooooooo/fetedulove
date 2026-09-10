import type { Metadata } from "next";
import AfterContent from "./AfterContent";

export const metadata: Metadata = {
  title: "Retrouve tes photos — Fiona & Antoine",
  description:
    "Cherche ta carte de membre du Fan Club et retrouve toutes les photos du mariage où tu apparais.",
};

export default function AfterPage() {
  return <AfterContent />;
}
