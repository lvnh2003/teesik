"use client"

import PolicyPageLayout from "@/components/policy-page-layout"

export default function InspectionPolicyPage() {
  return (
    <PolicyPageLayout
      titleKey="inspectionPolicy.title"
      introKey="inspectionPolicy.intro"
      sections={[
        {
          titleKey: "inspectionPolicy.section1Title",
          items: [
            "inspectionPolicy.section1Item1",
            "inspectionPolicy.section1Item2",
            "inspectionPolicy.section1Item3",
            "inspectionPolicy.section1Item4",
          ],
        },
        {
          titleKey: "inspectionPolicy.section2Title",
          items: [
            "inspectionPolicy.section2Item1",
            "inspectionPolicy.section2Item2",
            "inspectionPolicy.section2Item3",
          ],
        },
        {
          titleKey: "inspectionPolicy.section3Title",
          items: [
            "inspectionPolicy.section3Item1",
            "inspectionPolicy.section3Item2",
            "inspectionPolicy.section3Item3",
            "inspectionPolicy.section3Item4",
          ],
        },
        {
          titleKey: "inspectionPolicy.section4Title",
          items: [
            "inspectionPolicy.section4Item1",
            "inspectionPolicy.section4Item2",
            "inspectionPolicy.section4Item3",
          ],
        },
        {
          titleKey: "inspectionPolicy.section5Title",
          textKey: "inspectionPolicy.section5Text",
        },
      ]}
    />
  )
}
