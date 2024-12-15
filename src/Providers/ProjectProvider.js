import { createContext, useContext, useEffect, useState } from "react";
import { v4 } from "uuid";

export const ProjectContext = createContext();

const initialData = [
  {
    id: v4(),
    title: "Folder1",
    files: [
      {
        id: v4(),
        title: "template1",
        code: 'cout<<"hello world";',
        language: "cpp",
      },
      {
        id: v4(),
        title: "template2",
        code: 'cout<<"hello world";',
        language: "cpp",
      },
    ],
  },
  {
    id: v4(),
    title: "Folder2",
    files: [
      {
        id: v4(),
        title: "template3",
        code: 'cout<<"hello world";',
        language: "cpp",
      },
    ],
  },
];

const defaultCodes = {
  cpp: `#include <iostream>
using namespace std;
int main() {
  cout << "Hello World!";
  return 0;
}`,

  javascript: `console.log("Hello World!");`,

  python: `print("Hello World")`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
  }`,
};

export const ProjectProvider = ({ children }) => {
  const [folders, setFolders] = useState(() => {
    const localData = localStorage.getItem('data');
    if(localData)
    {
      return JSON.parse(localData);
    }
    return initialData;
  });

  const createNewProject = (newProject) => {
    const { folderName, templateName, language } = newProject;
    const newFolders = [...folders];
    newFolders.push({
      id: v4(),
      title: folderName,
      files: [
        {
          id: v4(),
          title: templateName,
          code: defaultCodes[language],
          language: language,
        },
      ],
    });
    localStorage.setItem("data", JSON.stringify(newFolders));
    setFolders(newFolders);
  };

  const createNewFolder = (folderName) => {
      const newFolder = {
        id: v4(),
        title: folderName,
        files: []
      }

      const allFolders = [...folders, newFolder];
      localStorage.setItem('data', JSON.stringify(allFolders));
      setFolders(allFolders);
  };

  const deleteFolder = (id) => {
    const updatedFoldersList = folders.filter((folderItem) => {
      return folderItem.id !== id;
    })

    localStorage.setItem('data', JSON.stringify(updatedFoldersList));
    setFolders(updatedFoldersList);
  };  

  const editFolderTitle = (newFolderName, id) => {
    const updatedFoldersList = folders.map((folderItem) => {
      if(folderItem.id === id)
      {
        folderItem.title = newFolderName
      }
      return folderItem;
    })
    localStorage.setItem('data', JSON.stringify(updatedFoldersList));
    setFolders(updatedFoldersList);
  };

  const editFileTitle = (newFileName, folderId, fileId) => {
    const copiedFolders = [...folders];
    for(let i=0; i<copiedFolders.length; i++)
    {
      if(folderId === copiedFolders[i].id)
      {
        const files = copiedFolders[i].files
        for(let j=0; j<files.length; j++)
        {
          if(files[j].id === fileId)
          {
            files[j].title = newFileName;
            break;
          }
        }
        break;
      }
    }
    localStorage.setItem('data', JSON.stringify(folders));
    setFolders(folders);
  }

  useEffect(() => {
    if(!localStorage.getItem('data'))
    {
      localStorage.setItem("data", JSON.stringify(folders));
    }
  }, []);

  const projectFeatures = {
    folders,
    createNewProject,
    createNewFolder,
    deleteFolder,
    editFolderTitle,
    editFileTitle,
  };

  return (
    <ProjectContext.Provider value={projectFeatures}>
      {children}
    </ProjectContext.Provider>
  );
};
