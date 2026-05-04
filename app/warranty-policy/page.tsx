"use client"

import PolicyPageLayout from "@/components/policy-page-layout"

export default function WarrantyPolicyPage() {
  return (
    <PolicyPageLayout
      titleKey="warrantyPolicy.title"
      introKey="warrantyPolicy.intro"
      sections={[
        {
          titleKey: "warrantyPolicy.section1Title",
          items: [
            "warrantyPolicy.section1Item1",
            "warrantyPolicy.section1Item2",
            "warrantyPolicy.section1Item3",
          ],
        },
        {
          titleKey: "warrantyPolicy.section2Title",
          items: [
            "warrantyPolicy.section2Item1",
            "warrantyPolicy.section2Item2",
            "warrantyPolicy.section2Item3",
          ],
        },
        {
          titleKey: "warrantyPolicy.section3Title",
          items: [
            "warrantyPolicy.section3Item1",
            "warrantyPolicy.section3Item2",
            "warrantyPolicy.section3Item3",
            "warrantyPolicy.section3Item4",
            "warrantyPolicy.section3Item5",
          ],
        },
        {
          titleKey: "warrantyPolicy.section4Title",
          items: [
            "warrantyPolicy.section4Item1",
            "warrantyPolicy.section4Item2",
            "warrantyPolicy.section4Item3",
            "warrantyPolicy.section4Item4",
          ],
        },
        {
          titleKey: "warrantyPolicy.section5Title",
          items: [
            "warrantyPolicy.section5Item1",
            "warrantyPolicy.section5Item2",
            "warrantyPolicy.section5Item3",
            "warrantyPolicy.section5Item4",
          ],
        },
      ]}
    />
  )
}
