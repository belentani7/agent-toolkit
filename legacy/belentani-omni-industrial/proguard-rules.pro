# ProGuard Configuration for BELENTANI
# Optimize and obfuscate release builds

# ============================================
# General Rules
# ============================================

# Preserve line numbers for crash reporting
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Preserve annotations
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions

# ============================================
# Firebase
# ============================================

-keep class com.firebase.** { *; }
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ============================================
# Kotlin
# ============================================

-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }
-dontwarn kotlin.**
-dontwarn kotlinx.**

# Kotlin Metadata
-keepclassmembers class ** {
    *** **(kotlin.coroutines.Continuation);
}

# ============================================
# Stripe
# ============================================

-keep class com.stripe.** { *; }
-dontwarn com.stripe.**

# ============================================
# Google AI (Gemini)
# ============================================

-keep class com.google.ai.** { *; }
-keep class com.google.generativeai.** { *; }
-dontwarn com.google.ai.**
-dontwarn com.google.generativeai.**

# ============================================
# Retrofit & OkHttp
# ============================================

-keep class retrofit2.** { *; }
-keep class okhttp3.** { *; }
-keep interface retrofit2.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn retrofit2.**
-dontwarn okhttp3.**

# Retrofit does reflection on generic types
-keepattributes Signature
-keepattributes Exceptions

# ============================================
# GSON
# ============================================

-keep class com.google.gson.** { *; }
-keep class sun.misc.Unsafe { *; }
-keep class com.google.gson.stream.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# ============================================
# AndroidX
# ============================================

-keep class androidx.** { *; }
-keep interface androidx.** { *; }
-dontwarn androidx.**

# ============================================
# Material Design
# ============================================

-keep class com.google.android.material.** { *; }
-dontwarn com.google.android.material.**

# ============================================
# Application Classes
# ============================================

# Keep all Activities, Services, BroadcastReceivers, ContentProviders
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.Fragment
-keep public class * extends androidx.fragment.app.Fragment

# Keep View constructors
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

# ============================================
# Native Methods
# ============================================

-keepclasseswithmembernames class * {
    native <methods>;
}

# ============================================
# Enums
# ============================================

-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ============================================
# Parcelable
# ============================================

-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# ============================================
# R Classes
# ============================================

-keepclassmembers class **.R$* {
    public static <fields>;
}

# ============================================
# Optimization
# ============================================

# Optimization passes
-optimizationpasses 5

# Remove logging
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Remove unused code
-dontshrink
-dontskipnonpubliclibraryclassmembers

# ============================================
# Debugging
# ============================================

# Keep line numbers for debugging
-keepattributes SourceFile,LineNumberTable

# Keep method names for stack traces
-keepattributes MethodParameters

# ============================================
# Warnings
# ============================================

-dontwarn java.lang.invoke.**
-dontwarn sun.misc.Unsafe
-dontwarn sun.reflect.**
-dontwarn com.sun.**
