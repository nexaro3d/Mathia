export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { exercise } = req.body;

    if (!exercise) {
      return res.status(400).json({
        error: "Aucun exercice fourni"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: [
            {
              role: "system",
              content:
                "Tu es Mathia, un professeur de maths patient. Explique les exercices étape par étape en français. N'affiche pas seulement la réponse : aide l'élève à comprendre."
            },
            {
              role: "user",
              content: exercise
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erreur avec le service IA"
      });
    }

    return res.status(200).json({
      answer: data.output_text || "Je n'ai pas réussi à analyser cet exercice."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erreur serveur"
    });
  }
}