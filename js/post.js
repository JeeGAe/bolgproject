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
  let lastCaretLine = null; // Caret: 커서 (커서 위치의 엘리먼트)
  const uploadInput = document.querySelector('.upload input');
  uploadInput.addEventListener('change', function(evnet){
    const files = this.files;
    console.log(files);
    if(files.length > 0){
      for(const file of files){
        const fileType = file.type;
        if(fileType.includes('image')){
          console.log('image');
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          lastCaretLine = addFileToCurrentLine(lastCaretLine, img);
        }else if(fileType.includes('video')){
          console.log('video');
        }else if(fileType.includes('audio')){
          console.log('audio');
        }else{
          console.log('file');
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
})

function createNewLine(){
  const newLine = document.createElement('div');
  newLine.innerHTML = `<br>`;
  return newLine;
}
function addFileToCurrentLine(line, file){
  console.log(line); //nodeType == 3 이면 텍스트 노드이다
  if(line.nodeType === 3){
    line = line.parentNode;
  }
  line.insertAdjacentElement('afterend', createNewLine());
  line.nextSibling.insertAdjacentElement('afterbegin', file);
  line.nextSibling.insertAdjacentElement('afterend', createNewLine());
  return line.nextSibling.nextSibling;
}