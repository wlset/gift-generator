import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, ShoppingBag, Award } from "lucide-react"

// Fallback gift ideas to display when the API fails
const fallbackGiftIdeas = [
  {
    name: "Personalized Photo Album",
    description: "A custom photo album filled with memories.",
    reason: "A thoughtful way to celebrate your relationship and shared memories.",
    priceRange: "$25-$50",
    whereToBuy: ["Shutterfly", "Artifact Uprising", "Etsy"],
    recommendedBrands: ["Shutterfly", "Artifact Uprising", "Mixbook"],
  },
  {
    name: "Streaming Service Subscription",
    description: "A subscription to a premium streaming service.",
    reason: "Perfect for entertainment lovers to enjoy their favorite shows and movies.",
    priceRange: "$15-$20/month",
    whereToBuy: ["Netflix", "Disney+", "HBO Max"],
    recommendedBrands: ["Netflix", "Disney+", "Hulu"],
  },
  {
    name: "Gourmet Chocolate Box",
    description: "A selection of premium chocolates in an elegant gift box.",
    reason: "A delicious treat that's perfect for chocolate lovers.",
    priceRange: "$25-$50",
    whereToBuy: ["Godiva", "Lindt", "Local Chocolate Shops"],
    recommendedBrands: ["Godiva", "Ghirardelli", "Lindt"],
  },
  {
    name: "Wireless Earbuds",
    description: "High-quality wireless earbuds for music and calls.",
    reason: "Great for music lovers and people on the go.",
    priceRange: "$50-$150",
    whereToBuy: ["Amazon", "Best Buy", "Target"],
    recommendedBrands: ["Apple", "Samsung", "Jabra"],
  },
  {
    name: "Indoor Plant",
    description: "A low-maintenance indoor plant in a decorative pot.",
    reason: "Brings life to any space and shows thoughtfulness.",
    priceRange: "$15-$40",
    whereToBuy: ["Local Nurseries", "The Sill", "Bloomscape"],
    recommendedBrands: ["The Sill", "Bloomscape", "Plants.com"],
  },
]

export default function FallbackGiftIdeas() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-1 mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
          <div className="bg-white rounded-full p-2">
            <Gift className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          Suggested Gift Ideas
        </h2>
        <p className="text-gray-600 mb-6">
          Here are some popular gift suggestions while we work on personalized recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fallbackGiftIdeas.map((gift, index) => (
          <Card
            key={index}
            className="overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all rounded-xl shadow-md hover:shadow-xl group animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 pb-3 group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-purple-800 text-xl">{gift.name}</CardTitle>
                  <p className="mt-1 text-gray-700">{gift.description}</p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-white/90 text-purple-700 border-purple-200 font-medium px-3 py-1 shadow-sm"
                >
                  {gift.priceRange}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              <div className="flex items-start space-x-3">
                <Gift className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{gift.reason}</p>
              </div>

              {gift.recommendedBrands && gift.recommendedBrands.length > 0 && (
                <div className="flex items-start space-x-3 pt-4 border-t border-gray-100">
                  <Award className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Recommended Brands:</p>
                    <div className="flex flex-wrap gap-2">
                      {gift.recommendedBrands.map((brand, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 hover:from-amber-100 hover:to-yellow-100 transition-all"
                        >
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {gift.whereToBuy && gift.whereToBuy.length > 0 && (
                <div className="flex items-start space-x-3 pt-4 border-t border-gray-100">
                  <ShoppingBag className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Where to buy:</p>
                    <div className="flex flex-wrap gap-2">
                      {gift.whereToBuy.map((store, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all"
                        >
                          {store}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

