"use client"

import PolicyPageLayout from "@/components/policy-page-layout"

export default function PaymentGuidePage() {
  return (
    <PolicyPageLayout
      titleKey="paymentGuide.title"
      introKey="paymentGuide.intro"
      sections={[
        {
          titleKey: "paymentGuide.method1Title",
          items: [
            "paymentGuide.method1Item1",
            "paymentGuide.method1Item2",
            "paymentGuide.method1Item3",
          ],
        },
        {
          titleKey: "paymentGuide.method2Title",
          items: [
            "paymentGuide.method2Item1",
            "paymentGuide.method2Item2",
            "paymentGuide.method2Item3",
          ],
        },
        {
          titleKey: "paymentGuide.method3Title",
          items: [
            "paymentGuide.method3Item1",
            "paymentGuide.method3Item2",
            "paymentGuide.method3Item3",
          ],
        },
        {
          titleKey: "paymentGuide.notesTitle",
          items: [
            "paymentGuide.notesItem1",
            "paymentGuide.notesItem2",
            "paymentGuide.notesItem3",
          ],
        },
      ]}
    />
  )
}
