# Traffic Management Guide (AGTTM & MRWA)

A utility for traffic management personnel to calculate site setup requirements based on road speed, referencing AGTTM Part 3 and MRWA Code of Practice.

## 🚀 How to share this with your team

To make this app available to your Traffic Management employees on their phones or tablets, you need to "Deploy" it. We recommend using a free service like **Vercel** or **Netlify**.

### Step 1: Get your Code on GitHub
1.  Ensure all your files are uploaded to your GitHub repository.
2.  (You have already done this step!)

### Step 2: Deploy (Publish)
1.  Go to [Vercel.com](https://vercel.com) (or Netlify) and sign up with your GitHub account.
2.  Click **"Add New Project"** and select this GitHub repository.
3.  Click **Deploy**.

### Step 3: Share
Once deployed, Vercel/Netlify will give you a website link (e.g., `traffic-guide.vercel.app`). Send this link to your employees. They can open it on any device.

---

## Features
*   **Sign Spacing (AGTTM Part 3)**: Calculates spacing based on speed with tolerances and WA departures.
*   **Taper Lengths (AGTTM Part 3)**: Merge and Lateral Shift tapers based on Table 5.7 and user inputs.
*   **Lane Widths (MRWA CoP)**: Includes specific **MRWA departures** (3.2m for 61-80km/h).
*   **UHF Channels**: Guide for Available vs Restricted channels.
