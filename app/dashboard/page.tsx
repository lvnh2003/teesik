"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWishlist } from "@/contexts/wishlist-context";
import { OrderService } from "@/services/orders";
import { useLanguage } from "@/contexts/language-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Heart,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const { user, isLoggedIn, isLoading, logout, updateProfile } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    if (user) {
      setEditData({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/account");
    } else if (isLoggedIn) {
      OrderService.getUserOrders()
        .then((res) => setOrders(res?.data || []))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-20 border-b border-gray-200 bg-white">
        <div className="container px-4 mx-auto text-center">
          <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">
            {t("dashboard.title")}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase">
            {t("dashboard.welcomeBack")}
          </h1>
          <p className="text-xl text-gray-600">{t("dashboard.subtitle")}</p>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 shadow-lg">
              <h2 className="text-xl font-black tracking-tighter uppercase mb-6">
                {t("dashboard.personalInfo")}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">
                      {t("checkout.fullName")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-600">
                      {t("checkout.emailLabel")}
                    </p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{user.phone}</p>
                      <p className="text-sm text-gray-600">
                        {t("checkout.phoneNumber")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">
                      {new Date(user.created_at).toLocaleDateString(
                        language === "vi" ? "vi-VN" : "en-US",
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("dashboard.joinDate")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      {t("dashboard.editInfo")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                        {t("dashboard.editProfile")}
                      </DialogTitle>
                      <DialogDescription>
                        {t("dashboard.editProfileDesc")}
                      </DialogDescription>
                    </DialogHeader>
                    {updateError && (
                      <div className="bg-red-50 text-red-500 p-3 text-sm rounded-md mb-4 font-medium">
                        {updateError}
                      </div>
                    )}
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-600">
                          {t("checkout.emailLabel")}
                        </label>
                        <Input
                          disabled
                          value={user.email}
                          className="bg-gray-100 italic"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-600">
                          {t("checkout.fullName")}
                        </label>
                        <Input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          placeholder={t("dashboard.namePlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-gray-600">
                          {t("checkout.phoneNumber")}
                        </label>
                        <Input
                          value={editData.phone}
                          onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                          }
                          placeholder={t("dashboard.phonePlaceholder")}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditOpen(false)}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            setIsUpdating(true);
                            setUpdateError("");
                            await updateProfile(editData);
                            setIsEditOpen(false);
                            toast.success(t("auth.updateSuccess"));
                          } catch (e: any) {
                            setUpdateError(
                              e?.message || t("dashboard.updateError"),
                            );
                          } finally {
                            setIsUpdating(false);
                          }
                        }}
                        disabled={isUpdating}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        {isUpdating
                          ? t("common.saving")
                          : t("common.saveChanges")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="w-full border-black text-black hover:bg-black hover:text-white"
                  onClick={logout}
                >
                  {t("nav.logout")}
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Orders */}
              <div className="bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black tracking-tighter uppercase">
                    {t("dashboard.orders")}
                  </h3>
                  <ShoppingBag className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-3xl font-bold mb-2">
                  {loadingOrders ? "..." : orders.length}
                </p>
                <p className="text-sm text-gray-600">
                  {t("dashboard.totalOrders")}
                </p>
                <Link href="/account/orders" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-black text-black hover:bg-black hover:text-white"
                  >
                    {t("dashboard.viewOrders")}
                  </Button>
                </Link>
              </div>

              {/* Wishlist */}
              <div className="bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black tracking-tighter uppercase">
                    {t("dashboard.wishlist")}
                  </h3>
                  <Heart className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-3xl font-bold mb-2">
                  {wishlistItems.length}
                </p>
                <p className="text-sm text-gray-600">
                  {t("dashboard.wishlistItems")}
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-black text-black hover:bg-black hover:text-white"
                  onClick={() => router.push("/wishlist")}
                >
                  {t("dashboard.viewWishlist")}
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 shadow-lg">
              <h3 className="text-lg font-black tracking-tighter uppercase mb-6">
                {t("dashboard.recentOrders")}
              </h3>
              <div className="text-center py-12">
                {orders.length > 0 ? (
                  <div className="text-left space-y-4">
                    {orders.slice(0, 3).map((o) => (
                      <div
                        key={o.id}
                        className="border-b last:border-0 pb-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold">
                            {t("dashboard.order")} #{o.id}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {t("dashboard.status")}: {o.status} •{" "}
                            {o.total_amount}
                          </p>
                        </div>
                        <Link href="/account/orders">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black"
                          >
                            {t("dashboard.view")}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600">{t("dashboard.noActivity")}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {t("dashboard.startShoppingDesc")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
