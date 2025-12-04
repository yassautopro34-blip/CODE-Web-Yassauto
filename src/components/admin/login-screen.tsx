import React, { useState } from "react";

export function LoginScreen({ onLogin }: { onLogin: (pw: string) => boolean }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) alert("Mot de passe incorrect");
    else setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">YassAuto</h1>
        <p className="text-center text-gray-600 mb-8">Tableau de bord admin</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe admin
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
