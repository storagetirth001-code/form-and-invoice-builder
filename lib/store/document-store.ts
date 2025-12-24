"use client"

import { create } from "zustand"
import type { DocumentSchema, Component, DocumentType, Theme } from "@/lib/types/schema"
import { saveFormToStorage } from "@/lib/utils/form-storage"

interface DocumentState {
  document: DocumentSchema | null
  selectedComponentId: string | null
  history: DocumentSchema[]
  historyIndex: number

  // Actions
  createDocument: (type: DocumentType, title: string) => void
  loadDocument: (document: DocumentSchema) => void
  addComponent: (component: Component) => void
  updateComponent: (id: string, updates: Partial<Component>) => void
  removeComponent: (id: string) => void
  reorderComponents: (startIndex: number, endIndex: number) => void
  selectComponent: (id: string | null) => void
  updateTheme: (theme: Theme) => void
  updateTitle: (title: string) => void
  updateGoogleSheet: (sheetId: string, sheetUrl: string) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  document: null,
  selectedComponentId: null,
  history: [],
  historyIndex: -1,

  createDocument: (type, title) => {
    let newDoc: DocumentSchema

    if (type === "resume") {
      // For resume, we start with a minimal template structure instead of empty
      newDoc = {
        id: crypto.randomUUID(),
        type,
        theme: "minimal",
        title,
        components: [
          {
            id: "header",
            type: "resume-header",
            name: "Your Name",
            title: "Your Title",
            email: "email@example.com",
          },
          {
            id: "summary",
            type: "summary",
            content: "Professional summary goes here...",
          },
          {
            id: "experience",
            type: "experience",
            title: "Experience",
            items: [],
          },
          {
            id: "education",
            type: "education",
            title: "Education",
            items: [],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    } else {
      newDoc = {
        id: crypto.randomUUID(),
        type,
        theme: "clean",
        title,
        components: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    saveFormToStorage(newDoc)

    set({
      document: newDoc,
      history: [newDoc],
      historyIndex: 0,
      selectedComponentId: null,
    })
  },

  loadDocument: (document) => {
    set({
      document,
      history: [document],
      historyIndex: 0,
      selectedComponentId: null,
    })
  },

  addComponent: (component) => {
    const { document, history, historyIndex } = get()
    if (!document) return

    const updatedDoc: DocumentSchema = {
      ...document,
      components: [...document.components, component],
      updatedAt: new Date().toISOString(),
    }

    saveFormToStorage(updatedDoc)

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(updatedDoc)

    set({
      document: updatedDoc,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  updateComponent: (id, updates) => {
    const { document, history, historyIndex } = get()
    if (!document) return

    const updatedDoc: DocumentSchema = {
      ...document,
      components: document.components.map((comp) => (comp.id === id ? ({ ...comp, ...updates } as Component) : comp)),
      updatedAt: new Date().toISOString(),
    }

    saveFormToStorage(updatedDoc)

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(updatedDoc)

    set({
      document: updatedDoc,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  removeComponent: (id) => {
    const { document, history, historyIndex, selectedComponentId } = get()
    if (!document) return

    const updatedDoc: DocumentSchema = {
      ...document,
      components: document.components.filter((comp) => comp.id !== id),
      updatedAt: new Date().toISOString(),
    }

    saveFormToStorage(updatedDoc)

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(updatedDoc)

    set({
      document: updatedDoc,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedComponentId: selectedComponentId === id ? null : selectedComponentId,
    })
  },

  reorderComponents: (startIndex, endIndex) => {
    const { document, history, historyIndex } = get()
    if (!document) return

    const components = [...document.components] as Component[]
    const [removed] = components.splice(startIndex, 1)
    components.splice(endIndex, 0, removed)

    const updatedDoc: DocumentSchema = {
      ...document,
      components,
      updatedAt: new Date().toISOString(),
    }

    saveFormToStorage(updatedDoc)

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(updatedDoc)

    set({
      document: updatedDoc,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  selectComponent: (id) => {
    set({ selectedComponentId: id })
  },

  updateTheme: (theme) => {
    const { document, history, historyIndex } = get()
    if (!document) return

    const updatedDoc: DocumentSchema = {
      ...document,
      theme,
      updatedAt: new Date().toISOString(),
    }

    saveFormToStorage(updatedDoc)

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(updatedDoc)

    set({
      document: updatedDoc,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  updateTitle: (title) => {
    const { document } = get()
    if (!document) return

    const updatedDoc = {
      ...document,
      title,
      updatedAt: new Date().toISOString(),
    }

    saveFormToStorage(updatedDoc)

    set({
      document: updatedDoc,
    })
  },

  updateGoogleSheet: (sheetId, sheetUrl) => {
    const { document } = get()
    if (!document) return

    const updatedDoc = {
      ...document,
      googleSheetId: sheetId,
      googleSheetUrl: sheetUrl,
      updatedAt: new Date().toISOString(),
    }

    saveFormToStorage(updatedDoc)

    set({
      document: updatedDoc,
    })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      set({
        document: history[newIndex],
        historyIndex: newIndex,
      })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      set({
        document: history[newIndex],
        historyIndex: newIndex,
      })
    }
  },

  canUndo: () => {
    const { historyIndex } = get()
    return historyIndex > 0
  },

  canRedo: () => {
    const { history, historyIndex } = get()
    return historyIndex < history.length - 1
  },
}))
