"use client"

import PolicyPageLayout from "@/components/policy-page-layout"

export default function ReturnPolicyPage() {
  return (
    <PolicyPageLayout
      titleKey="returnPolicy.title"
      introKey="returnPolicy.intro"
      sections={[
        {
          titleKey: "returnPolicy.section1Title",
          items: [
            "returnPolicy.section1Item1",
            "returnPolicy.section1Item2",
            "returnPolicy.section1Item3",
            "returnPolicy.section1Item4",
          ],
        },
        {
          titleKey: "returnPolicy.section2Title",
          items: [
            "returnPolicy.section2Item1",
            "returnPolicy.section2Item2",
            "returnPolicy.section2Item3",
          ],
        },
        {
          titleKey: "returnPolicy.section3Title",
          items: [
            "returnPolicy.section3Item1",
            "returnPolicy.section3Item2",
            "returnPolicy.section3Item3",
            "returnPolicy.section3Item4",
          ],
        },
        {
          titleKey: "returnPolicy.section4Title",
          items: [
            "returnPolicy.section4Item1",
            "returnPolicy.section4Item2",
            "returnPolicy.section4Item3",
            "returnPolicy.section4Item4",
          ],
        },
        {
          titleKey: "returnPolicy.section5Title",
          items: [
            "returnPolicy.section5Item1",
            "returnPolicy.section5Item2",
          ],
        },
        {
          titleKey: "returnPolicy.section6Title",
          textKey: "returnPolicy.section6Text",
        },
      ]}
    />
  )
}
