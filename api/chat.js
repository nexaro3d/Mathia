export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }


  try {

    const { exercise } = req.body;


    if (!exercise || typeof exercise !== "string") {

      return res.status(400).json({
        error: "Exercice manquant"
      });

    }


    const apiKey = process.env.OPENAI_API_KEY;


    if (!apiKey) {

      return res.status(500).json({
        error: "OPENAI_API_KEY n'est pas configurée"
      });

    }


    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },

        body: JSON.stringify({

          model: "gpt-5-mini",

          instructions:
            "Tu es Mathia, un professeur de mathématiques patient. Réponds en français. Aide l'élève à comprendre son exercice étape par étape. Ne donne pas uniquement la réponse finale. Utilise une explication adaptée à un élève.",

          input: exercise

        })
      }
    );


    const data = await response.json();


    if (!response.ok) {

      console.error(data);

      return res.status(response.status).json({
        error: "Erreur du service IA"
      });

    }


    return res.status(200).json({

      answer:
        data.output_text ||
        "Je n'ai pas réussi à analyser cet exercice."

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Erreur interne du serveur"
    });

  }

}