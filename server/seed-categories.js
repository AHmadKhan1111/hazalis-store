// One-time seed script to ensure all 6 categories exist in the database
const mongoose = require("mongoose");
const config = require("./config/config");

const CategorySchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        label: { type: String, required: true },
        collection_icon: { type: String, default: "" },
    },
    { timestamps: true }
);
const Category = mongoose.model("Category", CategorySchema);

const requiredCategories = [
    { id: "wallet", label: "Wallet" },
    { id: "belts", label: "Belts" },
    { id: "laptop-bags", label: "Laptop Bags" },
    { id: "duffle-bags", label: "Duffle Bags" },
    { id: "jacket", label: "Jacket" },
    { id: "accessories", label: "Accessories" },
];

async function seed() {
    await mongoose.connect(config.mongoUri);
    console.log("✅ MongoDB connected");

    for (const cat of requiredCategories) {
        const existing = await Category.findOne({ id: cat.id });
        if (!existing) {
            await Category.create(cat);
            console.log(`✅ Created: ${cat.id}`);
        } else {
            console.log(`⏭️  Already exists: ${cat.id}`);
        }
    }

    // Show current state
    const all = await Category.find({});
    console.log("\n📦 All categories in DB:");
    all.forEach(c => console.log(`  - ${c.id}: "${c.label}" | icon: ${c.collection_icon ? "✅" : "❌ none"}`));

    await mongoose.disconnect();
    console.log("\n✅ Done!");
}

seed().catch(console.error);
