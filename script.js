async function generateRecipe() {
  const ingredients = document.getElementById("ingredients").value.trim();
  const result = document.getElementById("result");

  if (!ingredients) {
    alert("Please enter some ingredients.");
    return;
  }

  result.textContent = "Generating recipe... please wait.";

  const prompt = `You are a professional chef. Based ONLY on the following ingredients: ${ingredients}, generate as many complete recipes as possible.

Rules:
- Do NOT use any ingredient that is not listed.
- Do NOT assume pantry items like salt, pepper, or oil unless explicitly listed.
- If a complete recipe is not possible, suggest a simple preparation using the given items.
- Be creative, but strict about the available ingredients.
-IMPORTANT: If the ingredients list does NOT contain food, or if it contains something obviously unrelated (like 'car', 'rock', or 'computer'), then reply only with:
"Sorry, I only provide recipes based on food ingredients."

DO NOT attempt to turn non-food items into a recipe.

For each recipe, use this format:

Recipe Name: [Title]
Ingredients:
- [ingredient 1]
- [ingredient 2]
- ...

Instructions:
1. [Step 1]
2. [Step 2]
3. ...

Separate each recipe clearly with a dashed line (---).`;

  try {
    const cohereResponse = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: "Bearer 7NiBcnXBgwnBJlU5UTtodGKruHzGViokIulBkyeR", // ⬅️ Replace with your Cohere API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.1,
      }),
    });

    if (!cohereResponse.ok) {
      result.textContent = `❌ Cohere API error: ${cohereResponse.status} ${cohereResponse.statusText}`;
      return;
    }

    const cohereData = await cohereResponse.json();

    if (!(cohereData.generations && cohereData.generations.length > 0)) {
      result.textContent = "❌ No recipe generated. Try again or check your API key.";
      return;
    }

    const recipeText = cohereData.generations[0].text.trim();
    const recipeTitles = [...recipeText.matchAll(/Recipe Name:\s*(.+)/g)].map((m) => m[1]);

    result.innerHTML = "";
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent ='start';
    container.style.borderRadius = '10px';
    

    const recipes = recipeText.split("---").map((r) => r.trim()).filter(Boolean);

    for (let i = 0; i < recipes.length; i++) {
      
  const recipeDiv = document.createElement("div");
  recipeDiv.style.border = "1px solid #ccc";
  recipeDiv.style.borderRadius = "10px";
  recipeDiv.style.backgroundColor = "white";
  recipeDiv.style.color = "gray";
  recipeDiv.style.padding = "5px";
  recipeDiv.style.display = "flex";
  recipeDiv.style.flexDirection = "column"; // 🧠 Stack title on top
  recipeDiv.style.justifyContent = 'center';
  recipeDiv.style.minHeight = '400px';

  let h = recipeDiv.style.height;

  const title = recipeTitles[i] || `Recipe ${i + 1}`;
  const titleElem = document.createElement("h3");
  titleElem.textContent = title;
  titleElem.style.marginBottom = "1px"; // Optional spacing
  recipeDiv.appendChild(titleElem); // 🔝 Now it's always on top

  // 🔲 Wrapper for content row (text + image side-by-side)
  const contentRow = document.createElement("div");
  contentRow.style.display = "flex";
  contentRow.style.gap = "2px"; // optional spacing between columns

  // 📜 Recipe Text
  const pre = document.createElement("pre");
  pre.style.whiteSpace = "pre-wrap";
  pre.style.backgroundColor = "gray";
  pre.style.color = "white";
  pre.style.flex = "1"; // let it take available space
  pre.textContent = recipes[i];
  contentRow.appendChild(pre);

  // 🖼️ Image
  const imageUrl = generateImagePollinations(`${title}, professional food photography, high quality`);
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = title;
  img.style.flex = "1"; // let it share space with text
  img.style.maxWidth = "40%";
  img.style.height = h;
  img.style.borderRadius = "8px";
  contentRow.appendChild(img);

  // 📦 Add the row to the main container
  recipeDiv.appendChild(contentRow);
  container.appendChild(recipeDiv);
    }

    result.appendChild(container);
  } catch (err) {
    result.textContent = "❌ An error occurred while generating the recipe.";
    console.error(err);
  }
}

// 🔧 Helper: Generate image URL using Pollinations
function generateImagePollinations(prompt) {
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}`;
}






    