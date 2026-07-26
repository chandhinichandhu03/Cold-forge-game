using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

namespace GAMETHON.Engine
{
    public class AIBrain : MonoBehaviour
    {
        public string ollamaEndpoint = "http://localhost:11434/api/generate";
        public string modelName = "llama3";

        public IEnumerator QueryOllama(string prompt, Action<string> onComplete)
        {
            string jsonBody = "{\"model\":\"" + modelName + "\",\"prompt\":\"" + prompt + "\",\"stream\":false}";
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);

            using (UnityWebRequest request = new UnityWebRequest(ollamaEndpoint, "POST"))
            {
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
                request.downloadHandler = new DownloadHandlerBuffer();
                request.SetRequestHeader("Content-Type", "application/json");

                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success)
                {
                    onComplete?.Invoke(request.downloadHandler.text);
                }
                else
                {
                    onComplete?.Invoke("AI Fallback Response: NPC offline.");
                }
            }
        }
    }
}
