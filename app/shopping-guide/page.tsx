"use client"

import PolicyPageLayout from "@/components/policy-page-layout"

export default function ShoppingGuidePage() {
  return (
    <PolicyPageLayout
      titleKey="shoppingGuide.title"
      introKey="shoppingGuide.intro"
      sections={[
        {
          titleKey: "shoppingGuide.method1Title",
          items: [
            "shoppingGuide.method1Item1",
            "shoppingGuide.method1Item2",
            "shoppingGuide.method1Item3",
            "shoppingGuide.method1Item4",
            "shoppingGuide.method1Item5",
            "shoppingGuide.method1Item6",
          ],
        },
        {
          titleKey: "shoppingGuide.method2Title",
          items: [
            "shoppingGuide.method2Item1",
            "shoppingGuide.method2Item2",
            "shoppingGuide.method2Item3",
          ],
        },
        {
          titleKey: "shoppingGuide.method3Title",
          items: [
            "shoppingGuide.method3Item1",
            "shoppingGuide.method3Item2",
            "shoppingGuide.method3Item3",
          ],
        },
        {
          titleKey: "shoppingGuide.notesTitle",
          items: [
            "shoppingGuide.notesItem1",
            "shoppingGuide.notesItem2",
            "shoppingGuide.notesItem3",
            "shoppingGuide.notesItem4",
          ],
        },
      ]}
    />
  )
}
