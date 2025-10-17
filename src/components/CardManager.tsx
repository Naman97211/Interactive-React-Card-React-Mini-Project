import React, { useState, useEffect } from "react";
import { Heart, ThumbsDown, Edit, Save, X, RotateCcw } from "lucide-react";
import "./CardManager.css";

export default function CardManager() {
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem("cards");
    return savedCards
      ? JSON.parse(savedCards)
      : [
          { id: 1, title: "Beautiful Sunset", content: "A stunning view of the evening sky", likes: 0, dislikes: 0 },
          { id: 2, title: "Mountain Adventure", content: "Hiking trails in the Rockies", likes: 3, dislikes: 1 },
          { id: 3, title: "City Lights", content: "Night photography in downtown", likes: 1, dislikes: 0 },
        ];
  });

  const [nextId, setNextId] = useState(4);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardContent, setNewCardContent] = useState("");
  const [editingCardId, setEditingCardId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const addLike = (id) =>
    setCards(cards.map(card => card.id === id ? { ...card, likes: card.likes + 1 } : card));

  const addDislike = (id) =>
    setCards(cards.map(card => card.id === id ? { ...card, dislikes: card.dislikes + 1 } : card));

  const resetLikesDislikes = (id) =>
    setCards(cards.map(card => card.id === id ? { ...card, likes: 0, dislikes: 0 } : card));

  const addNewCard = () => {
    if (!newCardTitle.trim()) return;
    const newCard = {
      id: nextId,
      title: newCardTitle,
      content: newCardContent || "No description provided",
      likes: 0,
      dislikes: 0,
    };
    setCards([...cards, newCard]);
    setNextId(nextId + 1);
    setNewCardTitle("");
    setNewCardContent("");
  };

  const startEditing = (card) => {
    setEditingCardId(card.id);
    setEditTitle(card.title);
    setEditContent(card.content);
  };

  const saveEdit = () => {
    setCards(cards.map(card =>
      card.id === editingCardId ? { ...card, title: editTitle, content: editContent } : card
    ));
    setEditingCardId(null);
  };

  const cancelEdit = () => setEditingCardId(null);
  const deleteCard = (id) => setCards(cards.filter(card => card.id !== id));

  return (
    <div className="container">
      <div className="header">
        <h1>Card Manager</h1>
        <p>Create, edit, and track likes/dislikes for your cards</p>
      </div>

      <div className="new-card">
        <h2>Create New Card</h2>
        <input
          type="text"
          className="input"
          placeholder="Enter card title"
          value={newCardTitle}
          onChange={e => setNewCardTitle(e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="Enter card description (optional)"
          value={newCardContent}
          onChange={e => setNewCardContent(e.target.value)}
          rows={3}
        />
        <button className="button" onClick={addNewCard} disabled={!newCardTitle.trim()}>
          Add Card
        </button>
      </div>

      <div className="cards-grid">
        {cards.map(card => (
          <div key={card.id} className="card">
            {editingCardId === card.id ? (
              <div className="card-content">
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="input" />
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="textarea" rows={3} />
                <div className="edit-buttons">
                  <button className="cancel-button" onClick={cancelEdit}><X /> Cancel</button>
                  <button className="edit-button" onClick={saveEdit}><Save /> Save</button>
                </div>
              </div>
            ) : (
              <>
                <div className="card-header">
                  {card.title}
                  <button onClick={() => startEditing(card)}><Edit /></button>
                </div>
                <div className="card-content">
                  <div className="like-row">
                    <span>{card.likes}</span>
                    <Heart className="heart liked" onClick={() => addLike(card.id)} />
                    <span>{card.dislikes}</span>
                    <ThumbsDown className="heart not-liked" onClick={() => addDislike(card.id)} />
                    {/* ✅ Reset Button */}
                    <button className="reset-button" onClick={() => resetLikesDislikes(card.id)}>
                      <RotateCcw /> Reset
                    </button>
                  </div>
                  <p>{card.content}</p>
                  <button className="delete-button" onClick={() => deleteCard(card.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {cards.length === 0 && <div className="no-cards">No cards yet. Create your first card!</div>}
    </div>
  );
}
