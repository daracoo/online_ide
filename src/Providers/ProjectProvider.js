import { createContext, useContext, useEffect, useState} from "react";
import {v4} from 'uuid'

export const ProjectContext = createContext();

const initialData = [
    {
        id: v4(),
        title: 'Folder1',
        files: [
            {
                id:v4(),
                title: 'template1',
                code: 'cout<<"hello world";',
                language: 'cpp'
            },
            {
                id:v4(),
                title: 'template2',
                code: 'cout<<"hello world";',
                language: 'cpp'
            },

        ]
    },
    {
        id: v4(),
        title: 'Folder2',
        files: [
            {
                id:v4(),
                title: 'template3',
                code: 'cout<<"hello world";',
                language: 'cpp'
            },
            

        ]
    },


];

const defaultCodes = {
  'cpp': `#include <iostream>
using namespace std;
int main() {
  cout << "Hello World!";
  return 0;
}`,

  'javascript': `console.log("Hello World!");`,

  'python': `print("Hello World")`,

  'java': `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
  }`
};

export const ProjectProvider = ({children}) => {
  const [folders, setFolders] = useState(initialData);

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
  }

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(folders));
  }, []);

  const projectFeatures = {
    folders,
    createNewProject
  }

  return (
    <ProjectContext.Provider value={projectFeatures}>
      {children}
    </ProjectContext.Provider>
  );
}