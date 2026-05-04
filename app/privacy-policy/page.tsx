"use client"

import PolicyPageLayout from "@/components/policy-page-layout"

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout
      titleKey="privacyPolicy.title"
      introKey="privacyPolicy.intro"
      sections={[
        {
          titleKey: "privacyPolicy.section1Title",
          introKey: "privacyPolicy.section1Intro",
          items: [
            "privacyPolicy.section1Item1",
            "privacyPolicy.section1Item2",
            "privacyPolicy.section1Item3",
            "privacyPolicy.section1Item4",
          ],
        },
        {
          titleKey: "privacyPolicy.section2Title",
          introKey: "privacyPolicy.section2Intro",
          items: [
            "privacyPolicy.section2Item1",
            "privacyPolicy.section2Item2",
            "privacyPolicy.section2Item3",
            "privacyPolicy.section2Item4",
          ],
        },
        {
          titleKey: "privacyPolicy.section3Title",
          items: [
            "privacyPolicy.section3Item1",
            "privacyPolicy.section3Item2",
            "privacyPolicy.section3Item3",
          ],
        },
        {
          titleKey: "privacyPolicy.section4Title",
          items: [
            "privacyPolicy.section4Item1",
            "privacyPolicy.section4Item2",
          ],
        },
        {
          titleKey: "privacyPolicy.section5Title",
          items: [
            "privacyPolicy.section5Item1",
            "privacyPolicy.section5Item2",
            "privacyPolicy.section5Item3",
          ],
        },
        {
          titleKey: "privacyPolicy.section6Title",
          textKey: "privacyPolicy.section6Text",
        },
        {
          titleKey: "privacyPolicy.section7Title",
          textKey: "privacyPolicy.section7Text",
        },
      ]}
    />
  )
}
