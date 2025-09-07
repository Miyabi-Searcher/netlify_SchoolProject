'use strict';
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

//キャラクターデータ
const $Character_Elements = [
//アンパンマン
['アンパンマン','Anpanman_Base.png',''],
//ヴィンダルディル厶
['ヴィンダルディル厶','Vindardilm_Base_FitAlpha.png','']
];


//台詞動作オブジェクト
const dialogue1 = [
//0
['全く…洒落にならないよ。アンパンマン。','ヴィンダルディル厶',$Character_Elements[1],$Character_Elements[0],'base','2p'],

//1
['ごめん、ヴィンダルディル厶。アレしか方法が無かったんだ。','アンパンマン',$Character_Elements[0],null,'base','2p'],

//2
['まぁ、いつものことか…ほら、早く行くよ。先は長いんだ。','ヴィンダルディル厶',$Character_Elements[1],null,'base','2p'],


['思えばこの時、私はどことない違和感、あるいは焦燥感に似たものを感じていたのかも知れない。','アプリ開発者の少年',null,null,'base','0p'],


['それは半分正解で半分間違いであった訳だが、少なくとも当時の私は、この二人の会話に口を挟む勇気は無く、その事情を知る由もなかった。','アプリ開発者の少年',null,null,'base','Non'],


['しかし、結局私は選択を迫られることになる。','アプリ開発者の少年',null,null,'base','Non'],

//3
['ねえ、ヴィンダルディル厶は…','アンパンマン',$Character_Elements[0],null,'base','2p'],

];

const dialogue1_choice1 = [
['言っちゃえば？ヴィンダルディル厶',0],

['「俺のこと好きか…？」',1],

['お熱いね〜！！',2],

];

const dialogue1_1 = [
['分かったような口をきくないっ！','ヴィンダルディル厶',$Character_Elements[1],null,'base','1p']

];

const dialogue1_2 = [
['怒りの果て、お前の決断、それすなわち闘争の喜ぴ…','ヴィンダルディル厶',$Character_Elements[1],null,'base','2p']

];

const dialogue1_3 = [
['もちが食べたいッピ','ヴィンダルディル厶',$Character_Elements[1],null,'base','2p']

];


//グローバル変数
var dialogue_select = 0;
const dialogue_box = document.getElementById('Dialogue_Box');
let dialogue_stop = false;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let modo_1p = false;
let modo_2p = false;
const characters = document.getElementById('Characters');
const character1_box = document.getElementById('Character_Box_1');
const character1 = document.getElementById('Character_1');
let current_character1_image = character1.getAttribute('src');
let current_character1_name = '';
let character2_box = null;
let character2 = null;
let current_character2_image = null;
let current_character2_name = '';
const dialogue_triangle = document.getElementById('triangle');


//クリック音登録
let click_audio_buffer = null;
let click_audio_buffer_source = null;
(async () => {
  const response = await fetch('MouseClick.mp3')
  const response_buffer = await response.arrayBuffer();
 
  click_audio_buffer = await ctx.decodeAudioData(response_buffer);

  prepareClickAudioBufferNode();

})();

function prepareClickAudioBufferNode() {
  click_audio_buffer_source = ctx.createBufferSource();
  click_audio_buffer_source.buffer = click_audio_buffer;
  click_audio_buffer_source.connect(ctx.destination);
};


//選択肢決定音登録
let choice_audio_buffer = null;
let choice_audio_buffer_source = null;
(async () => {
  const response = await fetch('MouseClick.mp3')
  const response_buffer = await response.arrayBuffer();
 
  choice_audio_buffer = await ctx.decodeAudioData(response_buffer);

  prepareChoiceAudioBufferNode();

})();

function prepareChoiceAudioBufferNode() {
  choice_audio_buffer_source = ctx.createBufferSource();
  choice_audio_buffer_source.buffer = choice_audio_buffer;
  choice_audio_buffer_source.connect(ctx.destination);
};


//進行休止関数

function DialogueOn(){
    dialogue_box.style.opacity = '1';
    dialogue_box.style.pointerEvents = 'auto';
    dialogue_stop = false;
    AcccessDialogue();
};

function DialogueOff(playStopTime){
    dialogue_box.style.opacity = '0';
    dialogue_box.style.pointerEvents = 'none';
    setTimeout(() => {
    document.body.addEventListener('click', DialogueOn,{ once: true });
    },playStopTime * 1000)
};






//台詞動作オブジェクト
var Dialogue = function(element,max,bg){
    //プロパティ
    this.element = element;
    this.max = max;
    this.endCheck = false
}
Dialogue.prototype.setting = async function(){

    const inputAllay = this.element
    var $splitted = inputAllay[dialogue_select][0].split('');
    const character_number = inputAllay[dialogue_select][5];
    const dialogue_text = document.getElementById('Dialogue_Text');
    const dialogue_character_name = document.getElementById('Name_Box');
    if(this.max == 'max'){
        this.max = inputAllay.length -1;
    };

    dialogue_text.textContent = '';
    dialogue_character_name.textContent = inputAllay[dialogue_select][1];
    dialogue_triangle.classList.add('hidden')

    click_audio_buffer_source.start(0);
    prepareClickAudioBufferNode();
 
    //キャラクターセット命令
    function CharacterSet(){

        var character1_justChange_Bool = true 
        var character2_justChange_Bool = false 
 
        switch(character_number){
            case '0p':
                modo_1p = false
                modo_2p = false

                if(current_character1_image !== null && character2_box !== null){
                    new Promise(async(resolve)=>{
                    characters.style.opacity = '0';
                    current_character1_name = '';
                    current_character2_name = '';
                    await sleep(500)            
                    resolve();
                    }).then(()=>{
                    character1.removeAttribute('src', current_character1_image);
                    character2_box.remove();
                    character2_box == null;
                    });
                }else{
                    new Promise(async(resolve)=>{
                    characters.style.opacity = '0';
                    current_character1_name = '';
                    await sleep(500)            
                    resolve();
                    }).then(()=>{
                    character1.removeAttribute('src', current_character1_image);
                    });
                };
            break;

            case '1p':
                var dialogue_character = inputAllay[dialogue_select][2];
                var dialogue_character_name = dialogue_character[0];
                var dialogue_character_image = dialogue_character[1];
                var absolute_2characterSet = inputAllay[dialogue_select][3];
                modo_1p = true;
                modo_2p = false
                
                new Promise((resolve)=>{  

                if(current_character1_image !== dialogue_character_image){
                    new Promise(async(resolve)=>{
                    characters.style.opacity = '0';
                    character1.setAttribute('src', dialogue_character_image);
                    character1_box.style.left = '50%' ;
                    character1_box.style.transform = 'translate(-50%,-50%)' ;  
                    current_character1_image = dialogue_character_image;
                    current_character1_name = dialogue_character_name;
                    await sleep(500);  
                    resolve();
                    }).then(()=>{
                    characters.style.opacity = '1';
                    });
                }
                else if(current_character1_image !== null && character2_box !== null){
                    new Promise(async(resolve)=>{
                    characters.style.opacity = '0';
                    character1.setAttribute('src', dialogue_character_image);
                    character1_box.style.left = '50%';
                    character1_box.style.transform = 'translate(-50%,-50%)';
                    current_character1_image = dialogue_character_image;
                    current_character1_name = dialogue_character_name; 
                    current_character2_name = '';
                    await sleep(500);          
                    resolve();
                    }).then(()=>{
                    character2_box.remove();
                    character2_box == null;
                    modo_2p = false
                    characters.style.opacity = '1';
                    });
                };
                resolve();
                }).then(()=>{
                if(current_character1_name.includes(dialogue_character_name)){
                character1.classList.remove('Character_Wait');
                character1_box.style.zIndex = '1';
                }
                else{
                character1.classList.add('Character_Wait');
                character1_box.style.zIndex = '0';
                };
                });

            break;

            case '2p':
                var dialogue_character = inputAllay[dialogue_select][2];
                var dialogue_character_name = dialogue_character[0];
                var dialogue_character_image = dialogue_character[1];
                var absolute_2characterSet = inputAllay[dialogue_select][3];
                
                new Promise((resolve)=>{
                if(character2_box == null && modo_2p !== true){
                    characters.insertAdjacentHTML('beforeend', '<div class="Character_Boxes" id="Character_Box_2"><div id="Right_Character_Cover"></div><img id="Character_2" class="Character_Activ" src=" " alt="キャラクター右位置" /></div>');
                    character2_box = document.getElementById('Character_Box_2');
                    character2 = document.getElementById('Character_2');
                    character1_box.style.left = '0' ;
                    character1_box.style.transform = 'translate(0,-50%)' ;
                    modo_2p = true
                    modo_1p = false
                    setTimeout(() => {
                        characters.style.opacity = '1';
                    }, 200);
                };

                if(modo_2p == true && absolute_2characterSet !== null && current_character1_image !== dialogue_character_image && current_character2_image !== dialogue_character_image){
                    const absolute_2nd_character_name = absolute_2characterSet[0];
                    console.log('絶対2p');

                    new Promise(async(resolve)=>{
                    characters.style.opacity = '0';
                    character1.setAttribute('src', dialogue_character_image);
                    character2.setAttribute('src', absolute_2characterSet[1]);
                    current_character1_image = dialogue_character_image;
                    current_character1_name = dialogue_character_name;
                    current_character2_image = absolute_2characterSet[1];
                    current_character2_name = absolute_2nd_character_name;
                    await sleep(500)
                    resolve();
                    }).then(()=>{
                    characters.style.opacity = '1';
                    });
                }
                else if(current_character1_image !== dialogue_character_image && current_character2_image !== dialogue_character_image && character2_justChange_Bool){
                    console.log('左にセットパターン');

                    new Promise(async(resolve)=>{
                    character1_box.style.opacity = '0';
                    character1.setAttribute('src', dialogue_character_image);
                    current_character1_image = dialogue_character_image;
                    current_character1_name = dialogue_character_name;
                    await sleep(500);
                    resolve();
                    }).then(()=>{
                    character1_box.style.opacity = '1';
                    character1_justChange_Bool = true;
                    character2_justChange_Bool = false;
                    });
                }
                else if(current_character1_image !== dialogue_character_image && current_character2_image !== dialogue_character_image && character1_justChange_Bool){
                    console.log('右にセットパターン');

                    new Promise(async(resolve)=>{
                    character2_box.style.opacity = '0';
                    character2.setAttribute('src', dialogue_character_image);
                    current_character2_image = dialogue_character_image;
                    current_character2_name = dialogue_character_name;
                    await sleep(500);
                    resolve();
                    }).then(()=>{
                    character2_box.style.opacity = '1';
                    character1_justChange_Bool = false;
                    character2_justChange_Bool = true;
                    });
                }
                else if(dialogue_select <= 0 || absolute_2characterSet == null && current_character1_name == ''){
                    console.log('保険');

                    new Promise(async(resolve)=>{
                    characters.style.opacity = '0';
                    character1.setAttribute('src', dialogue_character_image);
                    character1_box.style.left = '50%' ;
                    character1_box.style.transform = 'translate(-50%,-50%)' ;      
                    current_character1_image = dialogue_character_image;
                    current_character1_name = dialogue_character_name; 
                    current_character2_name = '';
                    await sleep(500);  
                    resolve();
                    }).then(()=>{
                    character2_box.remove();
                    character2_box = null;
                    modo_2p = false
                    modo_1p = true
                    character1_justChange_Bool = true 
                    character2_justChange_Bool = false 
                    characters.style.opacity = '1';
                    });
                };
                resolve();
                }).then(()=>{        
                    if(current_character1_name.includes(dialogue_character_name)){
                    character1.classList.remove('Character_Wait')
                    character1_box.style.zIndex = '1'
                    }
                    else{
                    character1.classList.add('Character_Wait')
                    character1_box.style.zIndex = '0'
                    };

                    if(current_character2_name.includes(dialogue_character_name) && character2 !== null){
                    character2.classList.remove('Character_Wait')
                    character2_box.style.zIndex = '1'
                    }
                    else if(current_character2_name.includes(dialogue_character_name) !== true && character2 !== null){
                    character2.classList.add('Character_Wait')
                    character2_box.style.zIndex = '0'
                    };
                });

            break;

            case 'Non':
                character1.classList.add('Character_Wait');

                if(character2 !== null){
                character2.classList.add('Character_Wait')
                };
            break;
        };
    };

    //キャラクターセットタイミング
    if(dialogue_select > 0 && character_number !== inputAllay[dialogue_select - 1][5] && character_number !== 'Non'){
        characters.style.opacity = '0';
        await sleep(300);
        CharacterSet(inputAllay);
    }else if(!modo_1p && modo_2p && character_number == '1p' || modo_1p && !modo_2p && character_number == '2p'){
        characters.style.opacity = '0';
        await sleep(300);
        CharacterSet(inputAllay);
    }
    else{
        CharacterSet(inputAllay);
    };

    //セリフ部分設定
    for(var i = 0; i < $splitted.length; i++ ){
            dialogue_text.innerHTML += `<span class = hidden>${$splitted[i]}</span>`;
    };

    var Char = 0;
    var Timer_1 = setInterval(() => {
        const Spaned_Text = dialogue_text.querySelectorAll('.hidden')[Char];
        Spaned_Text.classList.add('fade');
        Char++;

        if(Char === $splitted.length){
            clearInterval(Timer_1);
            Timer_1 = null;
            dialogue_triangle.classList.remove('hidden')
            return;
        };
    },10);

    dialogue_select++;
    dialogue_box.removeEventListener('click',AcccessDialogue);
    await sleep (800);
    dialogue_box.addEventListener('click',AcccessDialogue);

    if(this.max < dialogue_select){
        this.endCheck = true;       
    };
    console.log(this.endCheck)
}
Dialogue.prototype.shake = function(run){
    if(run == dialogue_select){
        characters.classList.remove('charactersShake');
        characters.classList.add('charactersShake');
    };
};


//選択肢システム
var Choices = function(element){
    //プロパティ
    this.element = element;
    this.decision = false;
    this.dicisionNumber;
}
Choices.prototype.setting = function(){
    const choices_area = document.getElementById('Choices_Area');
    const choices_back_cover = document.getElementById('Choices_Back_Cover');

    choices_back_cover.classList.remove('hidden');
    dialogue_box.removeEventListener('click',AcccessDialogue);
    dialogue_triangle.classList.add('hidden')

    for(var i = 0; i<this.element.length; i++){
        choices_area.insertAdjacentHTML('beforeend',`<p class="Choice_Button">${this.element[i][0]}</p>`)        
    };

    var choices_button = document.querySelectorAll('.Choice_Button');

    for(let i = 0; i<choices_button.length; i++){
    dialogue_select = 0;
    choices_button[i].addEventListener('click',()=>{
    choices_back_cover.classList.add('hidden');
    choices_button.forEach(content =>{
        content.remove()
    });
    this.decision = true;
    this.dicisionNumber = this.element[i][1];
    AcccessDialogue();
    }); 
    };
    
}
Choices.prototype.endCheck = function(){
    if(this.decision){
        return true;
    }
    else{
        return false;
    }
};


//アイテムキャプチャー
var ItemCapture = function(content){
    //プロパティ
    this.content = content;
    this.itemCapture_area = document.getElementById('Item_Capture');
    this.itemCapture_box = document.getElementById('Item_Capture_Box');

}
ItemCapture.prototype.setting = async function (setFrame,endFrame){
    if(setFrame == dialogue_select){
        this.itemCapture_area.setAttribute('src', this.content);
        this.itemCapture_box.style.opacity = '1';
        this.itemCapture_box.style.width = '25%';  
    }
    else if(endFrame == dialogue_select){
        this.itemCapture_box.style.opacity = '0';
        this.itemCapture_box.style.width = '0'; 
        await sleep(500);
        this.itemCapture_area.removeAttribute('src', this.content);
    };   
};


//バックグラウンド
var BG = function(img){
    this.img = img;
    this.board = document.getElementById('bg');
    this.condition = true
}
BG.prototype.change = function(setFrame,waitTime){
    if(this.condition && setFrame == dialogue_select){
        this.board.style.backgroundImage =  `url(${this.img})`;
        DialogueOff(waitTime);
        dialogue_stop = true;
        this.condition = false;
    };
};


var Still = function(img){
    this.img = img;
    this.board = document.getElementById('still');
    this.startCondition = true;
    this.endCondition = true;
}
Still.prototype.setting = async function(setFrame,endFrame,waitTime){
    if(this.startCondition && setFrame == dialogue_select){
        this.board.style.backgroundImage =  `url(${this.img})`;
        DialogueOff(waitTime);
        dialogue_stop = true;
        this.startCondition = false;
    }
    else if(this.endCondition && endFrame == dialogue_select && this.condition){
        this.board.style.opacity = '0'
        DialogueOff(waitTime);
        dialogue_stop =true;
        this.endCondition = false;
    };   
};


//ブラックスクリーン
var BlackScreen = function(duration){
    this.duration = duration;
    this.shatter = document.getElementById('FadeOut_Black');
}
BlackScreen.prototype.fadeIn = function(){
    this.shatter.classList.remove('fadeOut')
    dialogue_select = 0
    return true;
}
BlackScreen.prototype.fadeOut = function(){
    this.shatter.classList.add('fadeOut')
    return true;
};



//効果音
var soundEffects = function(path,start){
    this.path = path;
    this.start = start;
    this.source = null;
    this.track = null;
    this.gainNode = ctx.createGain();
    this.condition = true;
}
soundEffects.prototype.setting = function(value){
    if(this.start == dialogue_select){
        this.source = new Audio(`${this.path}`)
        const soundDuration = this.source.duration;

        DialogueOff(soundDuration);
        dialogue_stop =true;
        this.track = ctx.createMediaElementSource(this.source);
        this.gainNode.gain.value = value;
        this.track.connect(this.gainNode).connect(ctx.destination);
        this.source.play();
        setTimeout(() => {
            this.source.pause();
            this.source = null;
            this.track = null;
            this.condition = false;
        }, (soundDuration * 1000) +500);
    };
}


//BGMセット
var BGM = function(path,start,end,fade){
    this.path = path;
    this.start = start;
    this.end = end;
    this.fadeDuration = fade;
    this.source = null;
    this.track = null;
    this.gainNode = ctx.createGain();
}
BGM.prototype.setting = function(value){
    if(this.start == dialogue_select){
        this.source = new Audio(`${this.path}`)
        this.track = ctx.createMediaElementSource(this.source);
        var now = ctx.currentTime;
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(value,now + this.fadeDuration);

        this.track.connect(this.gainNode).connect(ctx.destination);

        this.source.play();

    }
    else if (this.end == dialogue_select){
        var now =ctx.currentTime
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(value, now);
        this.gainNode.gain.linearRampToValueAtTime(0, now + this.fadeDuration);
        setTimeout(() => {
            this.source.pause();
            this.source = null;
            this.track = null;
        }, this.fadeDuration * 1000);
    };

};

//インスタンス
const B_screen = new BlackScreen(500);

const bg_sample = new BG('Yugioh_2.jpeg',3)

const bgm_ShiningStar = new BGM('maou_14_shining_star.mp3',0,5,3)

const scene1 = new Dialogue(dialogue1,6,null);
const scene1_item1 = new ItemCapture('ItemCapture_Samle1.png');
const scene1_choice1 = new Choices(dialogue1_choice1);
const scene1_1 = new Dialogue(dialogue1_1,0,null);
const scene1_2 = new Dialogue(dialogue1_2,0,null);
const scene1_3 = new Dialogue(dialogue1_3,0,null);


async function AcccessDialogue(){



    if(!scene1.endCheck){
        bg_sample.change(3,2);      
        bgm_ShiningStar.setting(0.1);
        scene1_item1.setting(3,6);
        scene1.shake(1);
        if(!dialogue_stop){
            scene1.setting();  
        };  
    };

    if(scene1.endCheck && !scene1_choice1.endCheck()){
        scene1_choice1.setting();
    };

    if(scene1_choice1.endCheck && scene1_choice1.dicisionNumber == 0 && !scene1_1.endCheck){
        scene1_1.setting();
    };

    if(scene1_choice1.endCheck && scene1_choice1.dicisionNumber == 1 && !scene1_2.endCheck){
        scene1_2.setting();
    };

    if(scene1_choice1.endCheck && scene1_choice1.dicisionNumber == 2 && !scene1_3.endCheck){
        scene1_3.setting();
    };

    if(scene1_1.endCheck || scene1_2.endCheck || scene1_3.endCheck){
        B_screen.fadeIn();
    };

};

document.getElementById('Choices_Back_Cover').classList.add('hidden');
B_screen.fadeOut();
dialogue_box.addEventListener('click',AcccessDialogue);
