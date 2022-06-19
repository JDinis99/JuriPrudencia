import './styles/App.css';
import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import Sidebar from './components/sidebar';

import TokenAnnotator from './tokenAnnotator/TokenAnnotator.tsx';
import ActionMenu from './components/actionMenu';
import PopUpMenu from './components/popUpMenu';
import OutsideClickHandler from 'react-outside-click-handler';

import {useMousePos} from "./utils/useMousePos";


const example_json = require("./data/example.json");


// Dictionary of entities by type, that is a dictionary of entitie name whose key is a list occurences of entitie
let allEntities = [
  {
    id: "ORG",
    label: "Organizacoes",
    expanded: true,
    children: []
  },
  {
    id: "PER",
    label: "Pessoas",
    expanded: true,
    children: []
  },
  {
    id: "DAT",
    label: "Datas",
    expanded: true,
    children: []
  },
  {
    id: "LOC",
    label: "Localizacoes",
    expanded: true,
    children: []
  },
  {
    id: "PRO",
    label: "Processos",
    expanded: true,
    children: []
  },
  {
    id: "MAT",
    label: "Matriculas",
    expanded: true,
    children: []
  }
]

function createChild (entitie) {
  let new_child = {
    id: entitie[3],
    label: entitie[3],
    expanded: true,
    children: [
      {
        id: entitie[1].toString(),
        label: entitie[1].toString(),
        data: entitie
      }
    ]
  }
  return new_child
}

  
function getAllEntities() {
  
  example_json.forEach(function (value) {
    value.entities.forEach(function (entitie) {

      let found = false

      // Divide entities per type
      if (entitie[0] === "ORG") {

        allEntities[0].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie) 
          allEntities[0].children.push(new_child)
        }
      }
      if (entitie[0] === "PER") {

        allEntities[1].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[1].children.push(new_child)
        }
      }
      if (entitie[0] === "DAT") {

        allEntities[2].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[2].children.push(new_child)
        }
      }
      if (entitie[0] === "LOC") {
        
        allEntities[3].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[3].children.push(new_child)
        }
      }
      if (entitie[0] === "PRO") {
        
        allEntities[4].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[3].children.push(new_child)
        }
      }
      if (entitie[0] === "MAT") {
        
        allEntities[5].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[3].children.push(new_child)
        }
      }
    })
  })

  // Sorting
  for (let i = 0; i < allEntities.length; i++) {
    allEntities[i].children.sort(function (a, b) {
      if (a.id < b.id)
        return -1;
      else
        return 1;
    })
  }

}


function App() {
  const editorRef = useRef(null);
  const [mode, setMode] = useState("Doccano")
  const [anom_test, setAnomText] = useState(null)
  const [anom, setAnom] = useState(null)
  const last_index = useRef(0)
  const last_tag = useRef(null)
  const [menuStyle, setMenuStyle] = useState({
    left: 0,
    top: 0,
    showMenu: false
  })

  const [popUpMenu, setPopUpMenu] = useState({
    showMenu: false,
    entities: {
      "PER":0,
      "DAT":0,
      "ORG":0,
      "LOC":0,
      "PRO":0,
      "MAT":0
    }
  })

  useEffect(() => {
    getAllEntities()
    setAnomText(anomText())
  }, [])

  const handleNewEntitie = (value, p) => {
    console.log(value[value.length - 1])
    // TODO: Update ALL Entitites based on new value
    setMenuStyle({
      left: p.left,
      top: p.top + 10,
      showMenu: true
    })
    let old_tag = anom.tag
    let new_anom = {
      value: value,
      tag: old_tag
    }
    last_index.current = value.length - 1
    setAnom(new_anom);
  }

  const handleEntitieChange = (index, p) => {
    setMenuStyle({
      left: p.left,
      top: p.top + 10,
      showMenu: true
    })

    last_index.current = index
  }

  const handleTagChange = e => {
    setMenuStyle({
      left: 0,
      top: 0,
      showMenu: false
    })

    let new_tag  = e.target.value
    last_tag.current = new_tag

    let entitie = anom.value[last_index.current]

    let per_number = 0
    let dat_number = 0
    let org_number = 0
    let loc_number = 0
    let pro_number = 0
    let mat_number = 0

    anom.value.forEach(function(ent) {
      if (ent.tag === "PER" && entitie.text === ent.text) {per_number += 1}
      else if (ent.tag === "DAT" && entitie.text === ent.text) {dat_number += 1}
      else if (ent.tag === "ORG" && entitie.text === ent.text) {org_number += 1}
      else if (ent.tag === "LOC" && entitie.text === ent.text) {loc_number += 1}
      else if (ent.tag === "PRO" && entitie.text === ent.text) {pro_number += 1}
      else if (ent.tag === "MAT" && entitie.text === ent.text) {mat_number += 1}
    })

    setPopUpMenu({
      showMenu: true,
      entities: {
        "PER": per_number,
        "DAT": dat_number,
        "ORG": org_number,
        "LOC": loc_number,
        "PRO": pro_number,
        "MAT": mat_number
      }
    })
  }

  const handleMultipleTagChange = e => {

    setPopUpMenu({
      showMenu: false,
      entities: {
        "PER":0,
        "DAT":0,
        "ORG":0,
        "LOC":0,
        "PRO":0,
        "MAT":0
      }
    })

    let new_anom = null
    let new_tag  = last_tag.current
    let old_value = anom.value
    let old_text = old_value[last_index.current].text
    let old_tag = old_value[last_index.current].tag
    let new_value = []

    if (e.target.value === "Single") {
      
      if (new_tag == "Remove") {
        let old_tag = anom.tag
        let slice_1 = old_value.slice(0, last_index.current)
        let slice_2 = old_value.slice(last_index.current + 1)
        new_value = slice_1.concat(slice_2)
        new_anom = {
          value: new_value,
          tag: old_tag
        }
      }
      else {
        old_value[last_index.current].tag = new_tag
        new_anom = {
          value: old_value,
          tag: new_tag
        }
      }
      setAnom(new_anom);
    }

    else if (e.target.value === "All-Equal") {
      old_value.forEach(function(entitie){
        if (new_tag == "Remove") {
          if (entitie.text === old_text && entitie.tag === old_tag) {
            // Ignore and dont add to new array
          }
          else {
            new_value.push(entitie)
          }
        }
        else {
          if (entitie.text === old_text && entitie.tag === old_tag) {
            // change tag
            entitie.tag = new_tag
          }
        }
      })

      if (new_tag == "Remove") {
        new_anom = {
          value: new_value,
          tag: old_tag
        }
        setAnom(new_anom);
      }

    }

    else if (e.target.value === "All-All") {
      old_value.forEach(function(entitie){
        if (new_tag == "Remove") {
          if (entitie.text === old_text) {
            // Ignore and dont add to new array
          }
          else {
            new_value.push(entitie)
          }
        }
        else {
          if (entitie.text === old_text) {
            // change tag
            entitie.tag = new_tag
          }
        }
      })

      if (new_tag == "Remove") {
        new_anom = {
          value: new_value,
          tag: old_tag
        }
        setAnom(new_anom);
      }
    }

  }

  
  const log = () => {
    if (editorRef.current) {
      //console.log(editorRef.current.getContent());
      let test = editorRef.current.selection.select(editorRef.current.dom.select('s')[0])
      console.log(test)
      test.scrollIntoView({behavior: "instant", block: "center", inline: "nearest"});
    }
  }

  function Side() {
    return (
      <div className='SideBar'>
        <Sidebar allMenuItems={allEntities}/>
      </div>
    )
  }

  function changeMode() {
    if (mode === "Editor") {
      setMode("Doccano")
    }
    if (mode === "Doccano") {
      setMode("Editor")
    }
  }

  function Header() {
    return (
      <>
        <header className='PageHeader'>
          Header
        </header>
        <button onClick={changeMode}>
          Mode change
        </button>
      </>
      )
  }

  const text = () => {
    let text = ""
    example_json.forEach(function(value) {
      let anonimized_text = value.text
      let anonimization = ""
      let substituion = ""
      value.entities.forEach(function(entitie) {
        if (entitie[0] === "ORG") {
          let substituion = "Substitute ORG"
          anonimization = "<font color=red><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "PER") {
          let substituion = "Substitute PER"
          anonimization = "<font color=green><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "DAT") {
          let substituion = "Substitute DAT"
          anonimization = "<font color=brown><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "LOC") {
          let substituion = "Substitute LOC"
          anonimization = "<font color=blue><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "PRO") {
          let substituion = "Substitute PRO"
          anonimization = "<font color=yellow><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "MAT") {
          let substituion = "Substitute MAT"
          anonimization = "<font color=red><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
      })
      text += '<p>' + anonimized_text + '</p>'
    })

    return text
  }

  const anomText = () => {
    let text = ""
    let final_entities = []

    // Counter for words not characters
    let counter = 0
    example_json.forEach(function(value) {

      value.entities.forEach(function(entitie) {
        let type = entitie[0]
        let tmp_str = value.text.slice(0, entitie[1])

        let start = counter + tmp_str.split(" ").length
        let end = start + entitie[3].split(" ").length

        let final_entitie = {
          start: start,
          end: end,
          tag: type,
          text: entitie[3]
        }

        final_entities.push(final_entitie)
      })
      if (value.text === "") {
        text += "\n"
      }
      else {
        counter += value.text.split(" ").length + 1
        text += " " + value.text + " \n"

      }

  })

    if (anom === null) {
      setAnom({
        value: final_entities,
        tag: "PER"
      })
    }

    return text
  }
  
  function box() {

    if (mode === "Editor") {
      return (
        <>
          <Editor tinymceScriptSrc="http://localhost:3000/tinymce/js/tinymce/tinymce.min.js"
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={text()}
            init={{
              toolbar_sticky: true,
              menubar: 'tools',
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'autoresize',
                'importcss',
                'example',
                'code'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help | code | example',
            }}
          />
          <button onClick={log}>Log editor content</button>
        </>
      )
    }

    if (mode === "Doccano") {

      if (anom === null || anom_test === null) {
        return <></>
      }
      return (
        <div className='Text'>
            <TokenAnnotator
              tokens={anom_test.split(" ")}
              value={anom.value}
              onNewEntitie={handleNewEntitie}
              onEntitieChange={handleEntitieChange}
              getSpan={span => ({
                ...span,
                tag: anom.tag,
              })}
            />
        </div>
      )
    }

  }
  

  return (
    <div className="App">
      {Header()}

      {Side()}

      {box()}

      <OutsideClickHandler onOutsideClick={() => {setMenuStyle({left:0,top: 0, showMenu: false})}}>
        {ActionMenu(menuStyle.left, menuStyle.top, menuStyle.showMenu, handleTagChange)}
      </OutsideClickHandler>

      <div className='PopUp'>
        <OutsideClickHandler onOutsideClick={() => {setPopUpMenu({showMenu: false, entities: {"PER":0, "DAT":0, "ORG":0, "LOC":0, "PRO":0, "MAT":0}})}}>
          {PopUpMenu(popUpMenu.showMenu, handleMultipleTagChange, popUpMenu.entities)}
        </OutsideClickHandler>
      </div>

    </div>
  );
}

export default App;
