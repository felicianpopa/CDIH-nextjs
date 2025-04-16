"use client";
import React, { useState } from "react";
import { KanbanBoard } from "Frontend-utils";
const Kanban = () => {
  // Define columns for the Kanban board
  const [columns, setColumns] = useState([
    { id: "backlog", title: "Backlog" },
    { id: "todo", title: "To Do" },
    { id: "inProgress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ]);

  // Sample data for the cards
  const [cards, setCards] = useState([
    {
      id: "task-1",
      columnId: "backlog",
      title: "Research competitor products",
      description: "Analyze the top 5 competitor products and create a report",
      priority: "Medium",
      tags: ["Research", "Marketing"],
      assignee: {
        name: "John Doe",
        avatar: null,
      },
    },
    {
      id: "task-2",
      columnId: "todo",
      title: "Create wireframes for new dashboard",
      description: "Design initial wireframes for the analytics dashboard",
      priority: "High",
      tags: ["Design", "UX"],
      assignee: {
        name: "Jane Smith",
        avatar: null,
      },
    },
    {
      id: "task-3",
      columnId: "inProgress",
      title: "Implement authentication system",
      description: "Set up OAuth integration with Google and Facebook",
      priority: "High",
      tags: ["Development", "Security"],
      assignee: {
        name: "Mike Johnson",
        avatar: null,
      },
    },
    {
      id: "task-4",
      columnId: "inProgress",
      title: "Optimize database queries",
      description: "Improve performance of the main product listing queries",
      priority: "Medium",
      tags: ["Backend", "Performance"],
      assignee: {
        name: "Sarah Williams",
        avatar: null,
      },
    },
    {
      id: "task-5",
      columnId: "review",
      title: "Fix checkout page bugs",
      description:
        "Address issues with payment processing and order confirmation",
      priority: "High",
      tags: ["Bug", "Frontend"],
      assignee: {
        name: "Alex Chen",
        avatar: null,
      },
    },
    {
      id: "task-6",
      columnId: "done",
      title: "Update privacy policy",
      description:
        "Review and update the privacy policy to comply with new regulations",
      priority: "Low",
      tags: ["Legal", "Content"],
      assignee: {
        name: "Lisa Brown",
        avatar: null,
      },
    },
  ]);

  // Define filters for the Kanban board
  const filters = [
    {
      name: "search",
      label: "Search",
      type: "search",
      placeholder: "Search tasks...",
      filterFunction: (card, value) => {
        const searchTerm = value.toLowerCase();
        return (
          card.title.toLowerCase().includes(searchTerm) ||
          (card.description &&
            card.description.toLowerCase().includes(searchTerm))
        );
      },
    },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      options: [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
      ],
      filterFunction: (card, value) => card.priority === value,
    },
    {
      name: "assignee",
      label: "Assignee",
      type: "select",
      options: [
        { value: "John Doe", label: "John Doe" },
        { value: "Jane Smith", label: "Jane Smith" },
        { value: "Mike Johnson", label: "Mike Johnson" },
        { value: "Sarah Williams", label: "Sarah Williams" },
        { value: "Alex Chen", label: "Alex Chen" },
        { value: "Lisa Brown", label: "Lisa Brown" },
      ],
      filterFunction: (card, value) =>
        card.assignee && card.assignee.name === value,
    },
    {
      name: "tag",
      label: "Tag",
      type: "select",
      options: [
        { value: "Research", label: "Research" },
        { value: "Marketing", label: "Marketing" },
        { value: "Design", label: "Design" },
        { value: "UX", label: "UX" },
        { value: "Development", label: "Development" },
        { value: "Security", label: "Security" },
        { value: "Backend", label: "Backend" },
        { value: "Performance", label: "Performance" },
        { value: "Bug", label: "Bug" },
        { value: "Frontend", label: "Frontend" },
        { value: "Legal", label: "Legal" },
        { value: "Content", label: "Content" },
      ],
      filterFunction: (card, value) => card.tags && card.tags.includes(value),
    },
  ];

  // Handle card move between columns
  const handleCardMove = (cardId, targetColumnId) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          return { ...card, columnId: targetColumnId };
        }
        return card;
      })
    );
  };

  // Handle card click
  const handleCardClick = (card) => {
    console.log("Card clicked:", card);
    // Here you would typically open a modal or navigate to a detail view
    alert(`Card clicked: ${card.title}`);
  };

  // Handle filter change
  const handleFilterChange = (activeFilters) => {
    console.log("Active filters:", activeFilters);
  };

  // Count cards in each column for the UI
  const columnsWithCount = columns.map((column) => ({
    ...column,
    count: cards.filter((card) => card.columnId === column.id).length,
  }));
  return (
    <div>
      <KanbanBoard
        boardData={cards}
        columns={columnsWithCount}
        filters={filters}
        onFilterChange={handleFilterChange}
        onCardMove={handleCardMove}
        onCardClick={handleCardClick}
      />
    </div>
  );
};

export default Kanban;
