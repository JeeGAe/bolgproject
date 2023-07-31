const scroller = new Scroller(false)// 스크롤 객체 생성

window.addEventListener('load', event => {
  //테마 변경 (다크/일반)
  const mode = document.querySelector('.mode');
  const header = document.querySelector('header');
  const icons = header.querySelectorAll('.fa-solid');

  const title = document.querySelector('.post-container .post-title input');
  const postContents = document.querySelector('.post-container .post-contents');
  const tagInput = document.querySelector('.post-container .post-tags input')
  
  mode.addEventListener('click', event => {
    document.body.classList.toggle('dark');
    header.classList.toggle('dark');

    title.classList.toggle('dark');
    postContents.classList.toggle('dark');
    tagInput.classList.toggle('dark');

    for(const icon of icons){
      icon.classList.contains('active') ?
        icon.classList.remove('active') :
        icon.classList.add('active');
    }
  })

  // 태그 입력 기능
  const tagList = document.querySelector('.post-container .post-tags ul');
  const tagslimit = 10; //태그 갯수 제한
  const tagLength = 10; //태그 글자수 제한

  tagInput.addEventListener('keyup', function(event){
    const trimTag = this.value.trim();
    if(event.key === 'Enter' && trimTag !== '' && trimTag.length <= tagLength && tagList.children.length < tagslimit){
      const tag = document.createElement('li');
      tag.innerHTML = `
      #${trimTag}<a href="#">x</a>
      `
      tagList.appendChild(tag);
      this.value = ''; // 입력창 초기화
    }
  })

  // 태그 삭제 기능(이벤트 위임)
  tagList.addEventListener('click', function(event){
    event.preventDefault();
    if(event.target.hasAttribute('href')){
      tagList.removeChild(event.target.parentElement);
    }
  })

  // 파일 입력 처리
  postContents.focus(); // 첫 로딩때 커서 보이기
  postContents.insertAdjacentElement('afterbegin', createNewLine());
  let lastCaretLine = postContents.firstChild; // Caret: 커서 (커서 위치의 엘리먼트)
  const uploadInput = document.querySelector('.upload input');
  uploadInput.addEventListener('change', function(event){
    const files = this.files;
    console.log(files);
    if(files.length > 0){
      for(const file of files){
        const fileType = file.type;
        if(fileType.includes('image')){
          console.log('image');
          const image = buildMediaElement('img', {src : URL.createObjectURL(file)});
          lastCaretLine = addFileToCurrentLine(lastCaretLine, image);
        }else if(fileType.includes('video')){
          console.log('video');
          const video = buildMediaElement('video', 
            { className : 'video-file',
              controls : true,
              src : URL.createObjectURL(file)});
          lastCaretLine = addFileToCurrentLine(lastCaretLine, video);
        }else if(fileType.includes('audio')){
          console.log('audio');
          const audio = buildMediaElement('audio', 
            { className : 'audio-file',
              controls : true,
              src : URL.createObjectURL(file)});
          lastCaretLine = addFileToCurrentLine(lastCaretLine, audio);
        }else{
          console.log('file', file.name, file.size);
          const div = buildMediaElement('div',
          { className : 'normal-file',
            contentEditable : false, // 상속이 된상태이기 때문에 편집기가 되므로 방지
            innerHTML : `
              <div class="file-icon">
              <span class="material-icons">folder</span>
              </div>
              <div class="file-info">
              <h3>${getFileName(file.name, 70)}</h3>
              <p>${getFileSize(file.size)}</p>
              </div>
              `
            });
          lastCaretLine = addFileToCurrentLine(lastCaretLine, div);
        }
      }
      // 커서위치를 맨 마지막 추가한 파일 아래쪽에 보여주기
      const selection = document.getSelection()
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(lastCaretLine);
      range.collapse(); // 범위가 아니라 커서 지정
      selection.addRange(range);
      postContents.focus() // 편집기에 커서 보여주기
    }
  })
  postContents.addEventListener('blur', function(event){
    // 편집기가 blur 될때 마지막 커서 위치에 있는 엘리먼트
    lastCaretLine = document.getSelection().anchorNode;
    //console.log(lastCaretLine.parentNode, lastCaretLine);
  })
  // 텍스트 포맷
  const textTool = document.querySelector('.text-tool');
  const colorBoxes = textTool.querySelectorAll('.text-tool .color-box');
  const fontBox = textTool.querySelector('.text-tool .font-box');
  textTool.addEventListener('click', function(event){
    event.defaultPrevented();
    event.stopPropagation(); // document의 클릭이벤트와 충돌하지 않도록 설정(버블링)
    console.log(event.target);
    switch(event.target.innerText){
      case 'format_bold':
        changeTextFormat('bold'); // 사용자가 선택한 영역이 볼드체가 됨
        break;
      case 'format_italic':
        changeTextFormat('italic');
        break;
      case 'format_underlined':
        changeTextFormat('underline');
        break;
      case 'format_strikethrough':
        changeTextFormat('strikethrough');
        break;
      case 'format_color_text':
        // changeTextFormat('foreColor', event.target.style.backgroundColor);
        hideDropdown(textTool, 'format_color_text');
        colorBoxes[0].classList.toggle('show');
        break;
      case 'format_color_fill':
        // changeTextFormat('backColor', 'black');
        hideDropdown(textTool, 'format_color_fill');
        colorBoxes[1].classList.toggle('show');
        break;
      case 'format_size':
        // changeTextFormat('fontSize', 7);
        hideDropdown(textTool, 'format_size');
        fontBox.classList.toggle('show');
        break;
    }
    // postContents.focus({preventScroll: true});
    
  })
  colorBoxes[0].addEventListener('click', event => changeColor(event,'foreColor'));
  colorBoxes[1].addEventListener('click', event => changeColor(event,'backColor'));
  fontBox.addEventListener('click', event => changeFontSize(event))

  // 텍스트 정렬
  const alignTool = document.querySelector('.align-tool');
  alignTool.addEventListener('click', function(event){
    //console.log(event.target.innerText);
    event.defaultPrevented();
    event.stopPropagation();
    switch(event.target.innerText){
      case 'format_align_left':
        changeTextFormat('justifyLeft');
        break;
      case 'format_align_center':
        changeTextFormat('justifyCenter');
        break;
      case 'format_align_right':
        changeTextFormat('justifyRight');
        break;
      case 'format_align_justify':
        changeTextFormat('justifyFull');
        break;
    }
  })
  const linkTool = document.querySelector('.link-tool');
  const imoticonBox = linkTool.querySelector('.link-tool .imoticon-box');
  linkTool.addEventListener('click', function(event){
    // event.defaultPrevented();
    event.stopPropagation();
    switch(event.target.innerText){
      case 'sentiment_satisfied':
        hideDropdown(linkTool, 'sentiment_satisfied');
        imoticonBox.classList.toggle('show');
        break;
      case 'table_view':
        break;
      case 'link':
        break;
      case 'format_list_bulleted':
        break;
    }
  })
  imoticonBox.addEventListener('click', event => addImoticon(event))

})


function createNewLine(){
  const newLine = document.createElement('div');
  newLine.innerHTML = `<br>`;
  return newLine;
}
function addFileToCurrentLine(line, file){
  //console.log(line); //nodeType == 3 이면 텍스트 노드이다
  if(line.nodeType === 3){
    line = line.parentNode;
  }
  line.insertAdjacentElement('afterend', createNewLine());
  line.nextSibling.insertAdjacentElement('afterbegin', file);
  line.nextSibling.insertAdjacentElement('afterend', createNewLine());
  return line.nextSibling.nextSibling;
}

function getFileName(name, limit){
  // console.log(name.slice(0,limit));
  // console.log(name.lastIndexOf('.', name.length));
  return name.length > limit ? 
  `${name.slice(0,limit)}...${name.slice(name.lastIndexOf('.'), nema.length)}`
  : name;
}
// number : 파일용량 (Bytes)
function getFileSize(number){
  if(number < 1024){
    return number + 'bytes';
  }else if(number >= 1024 && number < 1048576){
    return (number/1024).toFixed(1) + 'KB';
  }else if(number >= 1048576){
    return (number/1048576).toFixed(1) + 'MB';
  }
}
// options : { className : 'audio, controls : 'true'}
function buildMediaElement(tag, options){
  const mediaElement = document.createElement(tag);
  for(const option in options){
    mediaElement[option] = options[option];
  }
  return mediaElement;
}

function changeTextFormat(style, param){
  // console.log(style);
  document.execCommand(style, false, param);
  // postContents.focus({preventScroll: true});
}

function hideDropdown(toolbox, currentDropdown){
  // 현재 text-tool요소 안쪽에서 열려있는 드랍다운 메뉴 조회
  const dropdown = toolbox.querySelector('.select-menu-dropdown.show');
  // if(dropdown){
  //   console.log(currentDropdown);
  //   console.log(dropdown?.parentElement);
  // }
  if(dropdown && dropdown.parentElement.querySelector('a span').innerText !== currentDropdown) dropdown.classList.remove('show');
}

document.addEventListener('click', function(event){
  // console.log(event.target);
  const dropdown = document.querySelector('.select-menu-dropdown.show');
  if(dropdown && !dropdown.contains(event.target)){
    dropdown.classList.remove('show');
  }
})

function changeColor(event, mode){
  event.stopPropagation(); // 상위요소로 클릭이벤트 버블링되지 않게 방지
  if(!event.target.classList.contains('select-menu-dropdown')){
    console.log(mode, event.target);
    switch(mode){
      case 'foreColor':
        changeTextFormat('foreColor', event.target.style.backgroundColor);
        break;
      case 'background':
        changeTextFormat('background', event.target.style.backgroundColor);
        break;
    }
    event.target.parentElement.classList.remove('show');
  }
}

function changeFontSize(event){
  event.stopPropagation(); // 상위요소로 클릭이벤트 버블링되지 않게 방지
  if(!event.target.classList.contains('select-menu-dropdown')){
    changeTextFormat('fontSize', event.target.id);
    event.target.parentElement.classList.remove('show');
  }
}

function addImoticon(event){
  console.log(event.target)
  event.stopPropagation();
  if(!event.target.classList.contains('select-menu-dropdown')){
    changeTextFormat('insertText', event.target.innerText);
    event.target.parentElement.classList.remove('show');
  }
}