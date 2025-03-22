"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { generateGiftIdeas, type GiftFormData } from "@/app/actions/generate-gifts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import GiftResults from "./gift-results"
import { Loader2, Gift, Sparkles, AlertCircle, Info } from "lucide-react"

const formSchema = z.object({
  recipientName: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  relationship: z.string().min(1, "Relationship is required"),
  interests: z.string().min(1, "Interests are required"),
  budget: z.string().min(1, "Budget is required"),
  preferredGiftType: z.string().min(1, "Preferred gift type is required"),
})

export default function GiftGenerator() {
  const [loading, setLoading] = useState(false)
  const [giftIdeas, setGiftIdeas] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<GiftFormData | null>(null)
  const [regenerateCount, setRegenerateCount] = useState(0)
  const [usingFallback, setUsingFallback] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<GiftFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      relationship: "friend",
      budget: "$25-$50",
      gender: "Not specified",
      preferredGiftType: "Any",
    },
  })

  const onSubmit = async (data: GiftFormData) => {
    setLoading(true)
    setError(null)
    setFormData(data)
    setRegenerateCount(0)
    setUsingFallback(false)

    try {
      console.log("Submitting form data:", data)
      const result = await generateGiftIdeas(data, false)

      console.log(
        "Result received:",
        result.success ? "Success" : "Failed",
        result.success ? `Got ${result.data?.length || 0} gift ideas` : result.error,
      )

      if (result.data) {
        setGiftIdeas(result.data)
        if (result.fallback) {
          setUsingFallback(true)
          setError(result.error || "Using generic gift ideas due to API issues.")
        }
      } else {
        setError(result.error || "Failed to generate gift ideas. Please try again.")
      }
    } catch (err) {
      console.error("Frontend error during gift generation:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    reset()
    setGiftIdeas(null)
    setError(null)
    setFormData(null)
    setRegenerateCount(0)
    setUsingFallback(false)
  }

  const handleRegenerateGifts = async () => {
    if (!formData) return

    setLoading(true)
    setError(null)
    setRegenerateCount((prev) => prev + 1)
    setUsingFallback(false)

    try {
      console.log("Regenerating with form data:", formData)
      const result = await generateGiftIdeas(formData, true)

      if (result.data) {
        setGiftIdeas(result.data)
        if (result.fallback) {
          setUsingFallback(true)
          setError(result.error || "Using generic gift ideas due to API issues.")
        }
      } else {
        setError(result.error || "Failed to regenerate gift ideas. Please try again.")
      }
    } catch (err) {
      console.error("Frontend error during gift regeneration:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {!giftIdeas ? (
        <Card className="p-8 shadow-xl rounded-xl border-purple-200 bg-white/80 backdrop-blur-sm animate-scale-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-purple-800 ml-3">Tell us about the birthday person</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="recipientName" className="text-purple-700 font-medium">
                  Recipient's Name
                </Label>
                <Input
                  id="recipientName"
                  placeholder="Enter name"
                  {...register("recipientName")}
                  className="border-purple-200 focus:border-purple-400 transition-all"
                />
                {errors.recipientName && <p className="text-red-500 text-sm">{errors.recipientName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-purple-700 font-medium">
                  Age
                </Label>
                <Input
                  id="age"
                  placeholder="Enter age"
                  {...register("age")}
                  className="border-purple-200 focus:border-purple-400 transition-all"
                />
                {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-purple-700 font-medium">
                  Gender
                </Label>
                <Select defaultValue="Not specified" onValueChange={(value) => setValue("gender", value)}>
                  <SelectTrigger id="gender" className="border-purple-200 focus:border-purple-400 transition-all">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                    <SelectItem value="Not specified">Not specified</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship" className="text-purple-700 font-medium">
                  Your Relationship
                </Label>
                <Select defaultValue="friend" onValueChange={(value) => setValue("relationship", value)}>
                  <SelectTrigger id="relationship" className="border-purple-200 focus:border-purple-400 transition-all">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="family">Family Member</SelectItem>
                    <SelectItem value="partner">Partner/Spouse</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.relationship && <p className="text-red-500 text-sm">{errors.relationship.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-purple-700 font-medium">
                  Budget
                </Label>
                <Select defaultValue="$25-$50" onValueChange={(value) => setValue("budget", value)}>
                  <SelectTrigger id="budget" className="border-purple-200 focus:border-purple-400 transition-all">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $25">Under $25</SelectItem>
                    <SelectItem value="$25-$50">$25-$50</SelectItem>
                    <SelectItem value="$50-$100">$50-$100</SelectItem>
                    <SelectItem value="$100-$200">$100-$200</SelectItem>
                    <SelectItem value="$200+">$200+</SelectItem>
                  </SelectContent>
                </Select>
                {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredGiftType" className="text-purple-700 font-medium">
                  Preferred Gift Type
                </Label>
                <Select defaultValue="Any" onValueChange={(value) => setValue("preferredGiftType", value)}>
                  <SelectTrigger
                    id="preferredGiftType"
                    className="border-purple-200 focus:border-purple-400 transition-all"
                  >
                    <SelectValue placeholder="Select gift type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Experiences">Experiences (e.g., concert tickets)</SelectItem>
                    <SelectItem value="Physical">Physical gifts (e.g., gadgets)</SelectItem>
                    <SelectItem value="DIY">DIY/Handmade</SelectItem>
                    <SelectItem value="Sentimental">Sentimental items</SelectItem>
                    <SelectItem value="Practical">Practical/Useful items</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredGiftType && <p className="text-red-500 text-sm">{errors.preferredGiftType.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="text-purple-700 font-medium">
                Interests & Hobbies
              </Label>
              <Textarea
                id="interests"
                placeholder="What do they enjoy? (e.g., cooking, hiking, reading sci-fi, playing guitar)"
                className="min-h-[100px] border-purple-200 focus:border-purple-400 transition-all"
                {...register("interests")}
              />
              {errors.interests && <p className="text-red-500 text-sm">{errors.interests.message}</p>}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Gift Ideas
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {usingFallback && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg shadow-sm animate-slide-up flex items-start mb-4">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Using generic gift suggestions</p>
                <p>
                  We're showing general gift ideas while our AI service is unavailable. These aren't personalized to
                  your specific request.
                </p>
              </div>
            </div>
          )}

          <GiftResults
            giftIdeas={giftIdeas}
            onRegenerate={handleRegenerateGifts}
            isLoading={loading}
            regenerateCount={regenerateCount}
            isFallback={usingFallback}
          />
          <div className="flex justify-center">
            <Button
              onClick={handleReset}
              variant="outline"
              className="mt-4 border-purple-200 hover:bg-purple-50 transition-all"
            >
              Start Over
            </Button>
          </div>
        </div>
      )}

      {error && !usingFallback && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm animate-slide-up flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error generating gift ideas</p>
            <p>{error}</p>
            <p className="text-sm mt-2">
              Make sure your environment variables are set up correctly. The application needs either
              GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY to be set.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

