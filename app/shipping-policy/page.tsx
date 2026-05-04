"use client"

import PolicyPageLayout from "@/components/policy-page-layout"

export default function ShippingPolicyPage() {
  return (
    <PolicyPageLayout
      titleKey="shippingPolicy.title"
      introKey="shippingPolicy.intro"
      sections={[
        {
          titleKey: "shippingPolicy.section1Title",
          items: [
            "shippingPolicy.section1Item1",
            "shippingPolicy.section1Item2",
            "shippingPolicy.section1Item3",
          ],
        },
        {
          titleKey: "shippingPolicy.section2Title",
          items: [
            "shippingPolicy.section2Item1",
            "shippingPolicy.section2Item2",
            "shippingPolicy.section2Item3",
          ],
        },
        {
          titleKey: "shippingPolicy.section3Title",
          items: [
            "shippingPolicy.section3Item1",
            "shippingPolicy.section3Item2",
            "shippingPolicy.section3Item3",
          ],
        },
        {
          titleKey: "shippingPolicy.section4Title",
          items: [
            "shippingPolicy.section4Item1",
            "shippingPolicy.section4Item2",
            "shippingPolicy.section4Item3",
          ],
        },
        {
          titleKey: "shippingPolicy.section5Title",
          items: [
            "shippingPolicy.section5Item1",
            "shippingPolicy.section5Item2",
          ],
        },
      ]}
    />
  )
}
