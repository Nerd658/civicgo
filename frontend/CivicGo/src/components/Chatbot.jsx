import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav'; // Importation du composant de navigation inférieure

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // État pour stocker les messages de la conversation
    const [inputMessage, setInputMessage] = useState(''); // État pour le message tapé par l'utilisateur
    const messagesEndRef = useRef(null); // Référence pour faire défiler la vue vers le bas

    // Définition des couleurs et styles pour la cohérence visuelle.
    const primaryColor = '#E4631D'; // Orange
    const backgroundColorLight = '#f6f7f8';
    const textColorLight = '#1A202C';
    const cardBackgroundColor = '#ffffff';
    const slate200 = '#e2e8f0';
    const slate500 = '#64748b';
    const slate900 = '#0f172a';

    // Effet pour faire défiler la vue vers le bas à chaque nouveau message.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fonction pour envoyer un message au chatbot.
    const sendMessage = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page.
        if (inputMessage.trim() === '') return; // Ne rien faire si le message est vide.

        const newMessage = { sender: 'user', text: inputMessage };
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Ajoute le message de l'utilisateur.
        setInputMessage(''); // Efface le champ de saisie.

        try {
            // Envoie le message de l'utilisateur au backend du chatbot.
            const response = await fetch('http://localhost:8000/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Une erreur s'est produite avec le chatbot.");
            }

            const data = await response.json();
            // Ajoute la réponse du chatbot à la conversation.
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: data.response }]);
        } catch (err) {
            // Gère les erreurs de communication avec le chatbot.
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: `Erreur: ${err.message}` }]);
        }
    };

    return (
        // Conteneur principal de la page du chatbot.
        <div className="relative mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden font-display" style={{ backgroundColor: backgroundColorLight, color: textColorLight }}>
            {/* En-tête de la page du chatbot. */}
            <div className="sticky top-0 z-10 w-full backdrop-blur-sm" style={{ backgroundColor: 'rgba(246, 247, 248, 0.8)' }}>
                <div className="flex items-center p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center">
                        {/* Bouton de retour vers le fil d'actualité. */}
                        <Link to="/feed" className="flex items-center justify-center size-10 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', color: textColorLight }}>
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </Link>
                    </div>
                    <h2 className="ml-2 flex-1 text-xl font-bold leading-tight tracking-[-0.015em]" style={{ color: slate900 }}>Chatbot CIVIC</h2>
                </div>
            </div>

            {/* Zone d'affichage des messages. */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        <p>Posez-moi une question sur l'application CIVIC !</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-gray-800'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Élément pour le défilement automatique. */}
            </div>

            {/* Zone de saisie du message. */}
            <div className="sticky bottom-0 z-20 w-full p-4" style={{ backgroundColor: cardBackgroundColor }}> {/* Added z-20 */}
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
                        style={{ borderColor: slate200, focusRingColor: primaryColor }}
                    />
                    <button
                        type="submit"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>

            {/* Barre de navigation inférieure. */}
            <BottomNav />
        </div>
    );
};

export default Chatbot;