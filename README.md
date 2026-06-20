# 🌍 EcoTrack AI: Comprehensive Technical Blueprint & Application Guide

Welcome to the **EcoTrack AI** platform—a highly-engineered, region-aware personal carbon accounting assistant designed to solve the accountability, accuracy, and engagement limitations of traditional sustainability trackers.

---

## 1. Chosen Vertical
**Vertical:** Sustainability, Individual Carbon Accounting, and Gamified Climate Action (CleanTech).

Traditional carbon calculators suffer from static, generic variables, lack of real-world proof (leading to "green-larping"), and passive recommendations that go ignored. **EcoTrack AI** bridges this gap by combining region-aware utility math, an active gamification checklist featuring an **upload proof verification system**, and a dynamic conversational **Large Language Model (LLM)** context proxy.

---

## 2. Dynamic Math & Approach

To avoid standard "one-size-fits-all" inaccuracies, EcoTrack AI's accounting model accounts for localized carbon intensities:

### A. Region-Aware Utility Constants
National electricity grids vary drastically in carbon intensity based on their fuel mix (coal vs. gas vs. renewables). We apply region-calibrated emission factors:
*   **Indonesia (ID) Grid:** `0.82 kg CO2e / kWh` (high coal concentration)
*   **United States (US) Grid:** `0.38 kg CO2e / kWh` (mixed fossil/renewables mix)
*   **European Union (EU) Grid:** `0.25 kg CO2e / kWh` (aggressive renewable/nuclear mix)

### B. Baseline Estimation Core Logic
During onboarding, a 4-step dynamic formula calculates the initial baseline footprint ($BF$ in kg CO2e/month):
$$BF = BF_{\text{transport}} + BF_{\text{diet}} + (E_{\text{kWh}} \times C_{\text{region}})$$

Where:
*   $BF_{\text{transport}}$ varies from `0 kg` (cycling/walking) to `50 kg` (public transit) to `180 kg` (gasoline vehicle).
*   $BF_{\text{diet}}$ scales based on agricultural methane/land loads: Vegan (`20 kg`), Vegetarian (`45 kg`), Average Meat (`110 kg`), Heavy Meat (`160 kg`).
*   $E_{\text{kWh}}$ tracks monthly home draws: Low (`100 kWh`), Moderate (`250 kWh`), High (`500 kWh`).
*   $C_{\text{region}}$ represents the environmental grid multiplier.

---

## 3. How the Solution Works

EcoTrack AI utilizes a highly visual, cohesive **Geometric Balance** layout, packed inside a fluid mobile phone mockup framework to model native application fidelity.

### Flow 1: Interactive Carbon Onboarding Profile
*   Users initialize their regional context, primary commuting mode, dietary choices, and utility draws in a sleek 4-step wizard before entering the main workspace.
*   Once completed, it instantly generates their calibrated carbon baseline.

### Flow 2: Live Impact Projection Dashboard
*   The interactive semi-circular gauge is responsive, scaling in real-time as users check off carbon-saving actions from their tracker.
*   **Future Projection Engine:** Annually scales monthly offsets ($O_{\text{month}}$):
    $$\text{Annual Savings} = O_{\text{month}} \times 12$$
*   **Offset Equivalency:** Estimates global tree absorption equivalents based on an average matured tree scrubbing `25 kg CO2` annually:
    $$\text{Trees Saved} = \frac{\text{Annual Savings}}{25}$$

### Flow 3: Gamification & Verification Loop ("The Truth Anchor")
*   Toggling checklist tasks (e.g., *Public Transport*, *Meat-Free Meals*) awards core XP and reduces the carbon pace in real-time.
*   **Proof Verification Layer:** To solve the accountability gap, completed but unverified actions prompt: *"📸 Earn +10 bonus pts verification!"*
*   Users trigger a seamless drag-and-drop or file-input panel to upload commuter tickets, receipt photos, or meal logs. This updates the task as **Verified**, granting a +10XP bonus.

### Flow 4: Reactive AI Assistant Context Proxy
*   Securely communicates with Google Gemini (`gemini-1.5-flash` or newer models) through Express server-side endpoints.
*   Before forwarding messages, the backend automatically attaches a **User Profile Context** string metadata payload (`region`, `transportType`, `dietType`, `energyType`). This forces the AI's standard recommendations to focus explicitly on the user's highest emission sources.

---

## 4. Key Engineering Assumptions Made
1.  **Grid Constants:** Carbon emission factors for regions are kept constant throughout a single session based on global climate watchdog data.
2.  **Tree Equivalence Ratio:** A standardized offset metric is assumed where one planted/preserved native tree absorbs approximately `25 kg CO2e` per year in real-world conditions.
3.  **Checklist Scale Factors:** Checklist daily savings ranges (e.g., transit saving `2.4 kg` per commute) map directly to real-world averages for mid-size metropolitan zones.
4.  **Local State Contingency:** If the back-end API proxy server is offline, the client gracefully transitions to an advanced local rule-based environmental counselor model to maintain uptime.
