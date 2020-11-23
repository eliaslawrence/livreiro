import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Platform, IonRange, MenuController } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import {Howl, Howler} from 'howler';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.page.html',
  styleUrls: ['./recorder.page.scss'],
})
export class RecorderPage implements OnInit {

    sentences: Array<string> = [
                            // "Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu.",//"Nunca pense que seu amor é impossível, nunca diga \"eu não acredito no amor\".";
                            // "Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos.",
                            // "A viagem era curta, e os versos pode ser que não fossem inteiramente maus.",
                            // "Sucedeu, porém, que, como eu estava cansado, fechei os olhos três ou quatro vezes; tanto bastou para que ele interrompesse a leitura e metesse os versos no bolso."
                            "Não consultes dicionários.", 
                            "Casmurro não está aqui no sentido que eles lhe dão, mas no que lhe pôs o vulgo de homem calado e metido consigo.",  
                            "Dom veio por ironia, para atribuir-me fumos de fidalgo.", 
                            "Tudo por estar cochilando!", 
                            "Também não achei melhor título para a minha narração; se não tiver outro daqui até o fim do livro, vai este mesmo.", 
                            "O meu poeta do trem ficará sabendo que não lhe guardo rancor.", 
                            "E com pequeno esforço, sendo o título seu, poderá cuidar que a obra é sua.", 
                            "Há livros que apenas terão isso dos seus autores; alguns nem tanto."
                               ];
    sentencesStart: Array<number> = [0];//Number.MAX_SAFE_INTEGER
    index: number = 0;
    data: Array<any>;
    chart: any;
    chartWidth: number;
    windowWidth: number;

    scrollLeft = 0;
    audioFile: MediaObject = null;// = this.media.create('./assets/mp3/como-nossos-pais.mp3');
    audioFile2: MediaObject = null;
    timestamp: any;
    formattedTime: string = "00:00:00.00";
    amplitudes: Array<any> = [];
    times: Array<any> = [];
    barWidth: number = 2;
    marginWidth: number = 2;
    scale: number = 10;

    player: Howl = null;    
    isPlaying    = false;
    @ViewChild('range', {static: false}) range: IonRange;
    progress     = 0;
    path: string = './assets/mp3/machado-de-assis.mp3';//machado-de-assis.mp3';como-nossos-pais.mp3
    touching: boolean = false;
    timeout: any;
    chartDiv: any;
    recordInterval: any;
    isRecording = false;

    startTime;

    // WEB AUDIO API
    audioContext = new AudioContext();
    dataArray;
    analyser;
    audio;
    source;
    duration;

    constructor(platform: Platform,
                private media: Media,
                private menuCtrl: MenuController,
                private route : ActivatedRoute,
                private router: Router,
                private file: File) { 

        this.menuCtrl.enable(false);
        platform.ready().then((readySource) => {
            console.log('Width: ' + platform.width());
            console.log('Height: ' + platform.height());            
            this.windowWidth = platform.width();

            // let duration = 2620;//2620;
            // if(duration > 100){
            //     this.chartWidth = this.windowWidth + (duration - 100) * this.windowWidth / 100 + 51 * this.windowWidth / 100;
            // }

            // for (let i = 0; i < duration; i++) {
                // this.amplitudes.push(Math.random());
            // }           
            
            // this.createChart(duration);
        });
    }

    async ngOnInit() { 
        this.startTime = new Date();  

        // this.getAmplitudes();
        // this.amplitudes = await this.getAmplitudes();
        // console.log(this.amplitudes);

        for (let i = 1; i < this.sentences.length; i++) {
            this.sentencesStart.push(Number.MAX_SAFE_INTEGER);
        } 

        this.start();
        this.chartDiv = document.getElementsByClassName('container')[0]; 
        this.updateProgress();
        console.log("INIT");
    }

    ngOnDestroy(){
        clearTimeout(this.timeout);
        if(this.player){
            this.isPlaying = false;
            this.player.stop();
        }  
        console.log("DESTROY");
    }

    next(){
        let sec = this.progress * this.player.duration() / 100;//this.chartDiv.scrollLeft/(this.scale*(this.barWidth + this.marginWidth));
        if(this.index < this.sentencesStart.length - 1){
            this.sentencesStart[++this.index] = sec;
        }
    }

    prev(){
        if(this.index > 0){
            this.sentencesStart[this.index--] = Number.MAX_SAFE_INTEGER;
        }
    }

    // getCurrentAmplitude(){
    //    console.log(this.file.getCurrentAmplitude);            
    // }

    getMillis(time){
        return (time % 1).toFixed(2).substring(2, 4);
    }

    getSeconds(time){
        return Math.floor(time % 60).toString().padStart(2, "0");
    }

    getMinutes(time){
        return Math.floor(((time / 60) % 60)).toString().padStart(2, "0");
    }

    getHour(time){
        return Math.floor(time / 3600).toString().padStart(2, "0");
    }

    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    lastTime = 0;

    // Play audio
    //
    record() {
        this.isRecording = true;

        if(!this.audioFile){
            console.log("START");
            this.audioFile = this.media.create(this.file.externalRootDirectory + '/machado-de-assis.mp3');
            this.audioFile.startRecord();                                      
            
            this.recordInterval = setInterval(
                (function(self) {         //Self-executing func which takes 'this' as self
                    return function() {   //Return a function in the context of 'self' 
                        // console.log(self.audioFile.getDuration()); 
                        // if(self.audioFile.getDuration() > self.lastTime + 0.1) {
                            // self.lastTime = self.audioFile.getDuration();
                            self.audioFile.getCurrentAmplitude().then((amp) => {
                                console.log(amp); 
                                self.amplitudes.push(amp);    
                                self.times.push(new Date());                        
                            });  
                        // }                                                            
                    }
                })(this),
                100     //normal interval, 'this' scope not impacted here.
            );  
        } else {
            console.log("RESUME");
            this.audioFile.resumeRecord();
        }
        
        //     // success callback
        //     function () { console.log("playAudio():Audio Success"); },
        //     // error callback
        //     function (err) { console.log("playAudio():Audio Error: " + err); }
        // );

        // Play audio
        // my_media.play();
        
        // await this.addData(100, this.chart);
        
        // await this.createChart(this.file.getDuration()*10);   
        // await this.increaseSize(51, this.chart);                
    }

    generateLabels(size) {
        var chartLabels = [];
        for (let x = 0; x < size; x++) {
            chartLabels.push(x);
        }
        
        return chartLabels;
    }

    generateData(size) {
        var chartData = [];
        for (let x = 0; x < size; x++) {
            chartData.push(Math.floor((Math.random() * 50) + 1));

            // if(x >= 100){
            //     this.chartWidth += this.windowWidth / 100; 
            // }
        }  
        
        // for (let x = 0; x < 51; x++) {
        //     chartData.push(1);

        //     if(x >= 100){
        //         this.chartWidth += this.windowWidth / 100; 
        //     }
        // }

        this.data = chartData;

        return chartData;
    }

    generateData2(size) {
        var chartData = [];
        for (let x = 0; x < size; x++) {
            chartData.push(this.data[x] * (-1));
        }

        return chartData;
    }

    addData(numData, chart) {
        for (var i = 0; i < numData; i++) {
            let newData = Math.random() * 50;
            chart.data.datasets[0].data.push(newData);
            chart.data.datasets[1].data.push(-newData);
            chart.data.labels.push(i);     
            // var chartAreaWrapper2Canvas = <HTMLCanvasElement> document.getElementsByClassName('chartAreaWrapper2')[0];
            // var newWidth = chartAreaWrapper2Canvas.width + 60;
            // console.log(newWidth);
            // chartAreaWrapper2Canvas.width = newWidth; 
            // console.log(chartAreaWrapper2Canvas.width);   

            this.chartWidth += this.windowWidth / 100;  
        }
        
        chart.update();
    }

    increaseSize(numData, chart) {
        for (var i = 0; i < numData; i++) {
            chart.data.datasets[0].data.push(0);
            chart.data.datasets[1].data.push(0);
            chart.data.labels.push(i);     

            this.chartWidth += this.windowWidth / 100;  
        }
        
        chart.update();
    }

    updateChart() {
        this.addData(50, this.chart);
    }

    async createChart(size) {
        var chartData = {
            labels: this.generateLabels(size),
            datasets: [{
                label: "Test Data Set",
                data: this.generateData(size)
            },
            {
                label: "Test Data Set",
                data: this.generateData2(size)
            }]
        };

        var rectangleSet = false;

        var canvasTest = <HTMLCanvasElement> document.getElementById('myChart');
        var chartTest = await new Chart(canvasTest.getContext('2d'), {
            type: 'bar',
            data: chartData,
            maintainAspectRatio: false,
            responsive: true,
            options: {
                tooltips: {
                    enabled: false
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: {
                            display:false
                        },
                        ticks: {
                            fontSize: 12,                            
                            beginAtZero: true,
                            display: false
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        gridLines: {
                            display:false
                        },
                        ticks: {
                            display: false
                        }
                    }]
                },
                animation: {
                    // onComplete: function () {
                    //     if (!rectangleSet) {
                    //         console.log(chartTest);
                    //         console.log(chartTest.scales['x-axis-0']);
                    //         console.log(chartTest.scales['y-axis-0']);
                            // var scale = window.devicePixelRatio;                       

                            // var sourceCanvas = chartTest.chart.canvas;
                            // var    copyWidth = chartTest.scales['y-axis-0'].width - 10;
                            // var   copyHeight = chartTest.scales['y-axis-0'].height + chartTest.scales['y-axis-0'].top + 10;

                            // var targetCanvas = <HTMLCanvasElement> document.getElementById("axis-Test");
                            // var targetCtx    = targetCanvas.getContext("2d");

                            // targetCtx.scale(scale, scale);
                            // targetCtx.canvas.width = copyWidth * scale;
                            // targetCtx.canvas.height = copyHeight * scale;

                            // targetCtx.canvas.style.width = `${copyWidth}px`;
                            // targetCtx.canvas.style.height = `${copyHeight}px`;
                            // targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth * scale, copyHeight * scale, 0, 0, copyWidth * scale, copyHeight * scale);

                            // var sourceCtx = sourceCanvas.getContext('2d');

                            // Normalize coordinate system to use css pixels.

                            // console.log(copyHeight * scale);
                            // sourceCtx.clearRect(0, 0, 80, copyHeight * scale);
                            // rectangleSet = true;
                    //     }
                    // },
                    // onProgress: function () {
                    //     if (rectangleSet === true) {
                    //         var  copyWidth = chartTest.scales['y-axis-0'].width;
                    //         var copyHeight = chartTest.scales['y-axis-0'].height + chartTest.scales['y-axis-0'].top + 10;

                    //         var sourceCtx = chartTest.chart.canvas.getContext('2d');
                    //         console.log(copyHeight);
                    //         sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
                    //     }
                    // }
                }                
            }
        });
        // this.file.getDuration()        
        
        
        this.chart = chartTest;

        // var canvasDiv = <HTMLCanvasElement> document.getElementsByClassName('chartAreaWrapper')[0];
        // canvasDiv.style.width = this.chartWidth + "px";

        // this.increaseSize(50, this.chart);
    }

    pauseRecord() {
        console.log("PAUSE");
        this.isRecording = false;        
        this.audioFile.pauseRecord();
        clearInterval(this.recordInterval);
    }

    stop() {
        console.log("STOP");
        if(this.player){
            this.isPlaying = false;
            this.player.stop();
        }   
        
        // if(this.audioFile){
            // this.isRecording = false;
            // this.audioFile.stopRecord();      
            // clearInterval(this.recordInterval);

            // let fileData = "";
            // for(let amp of this.amplitudes){
            //     fileData = fileData.concat(amp + " ");
            // }

            // this.writeToFile("amps.txt", fileData);

            // fileData = "";
            // for(let time of this.times){
            //     fileData = fileData.concat(time + " ");
            // }

            // this.writeToFile("times.txt", fileData);
        // }

        // this.readFile("amps.txt");
    }

    writeToFile(fileName, content){        
        this.file.writeFile(this.file.externalRootDirectory, fileName, content, {replace: true});
        alert("File saved at " + this.file.externalRootDirectory + fileName);
    }    

    readFile(directory, fileName){
        let fileData = this.file.readAsText(directory, fileName);        

        return fileData;
    }  

    async getAmplitudes(){
        let ampsString = [];

        console.log(this.file.applicationDirectory);
        // let fileData = await this.readFile(this.file.applicationDirectory + "www/assets/txt/", "amps.txt");
        let fileData = await this.readFile(this.file.externalRootDirectory, "amps.txt");
        
        ampsString = fileData.split(" ");      
        
        // let amps = [];
        for(let amp of ampsString){
            this.amplitudes.push(parseFloat(amp));
        }

        // return amps;
    } 

    saveMarkers(){  
        let endTime = new Date();    
        let diff = (endTime.getTime() - this.startTime.getTime())/1000;   
        
        console.log(diff);

        let fileData = diff + ": ";
        for(let marker of this.sentencesStart){
            fileData = fileData.concat(marker + " ");
        }

        this.writeToFile("markers.txt", fileData);        
    } 

    start() {
        // this.audioFile2 = this.media.create('./assets/mp3/como-nossos-pais.mp3');

        
        // if(this.player){
        //   this.player.stop();
        // }


        if(!this.player){
            this.player = new Howl({
            src: [this.path],
            html5: true,
            onplay: () => {
                this.isPlaying = true;

                // this.updateProgress();
            },
            onend: () => {
                this.isPlaying = false;                
            }
            });
        }
    }    

    async test() {
        this.audio = new Audio();
        this.audio.src = this.path;
        await this.audio.load();

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.connect(this.audioContext.destination);
        this.source = await this.audioContext.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.duration = this.audio.duration;
                
        // this.recordInterval = setInterval(
        //     (function(self) {         //Self-executing func which takes 'this' as self
        //         return function() {   //Return a function in the context of 'self'                        
        //             self.draw();                 
        //         }
        //     })(this),
        //     10     //normal interval, 'this' scope not impacted here.
        // );  

        // async, wait for audio to load before connecting to audioContext
        // audio.addEventListener("canplaythrough", (function(self){
        //     return function() {
        //         source.connect(this.analyser);
        //         // self.duration = audio.duration;
        //         self.draw();
        //     }
        // })(this)); 
                
        this.audio.play();

        for(let i = 0; i <= 10; i += 0.1){               
            setTimeout(
                (function(self) {         //Self-executing func which takes 'this' as self
                    return function() {   //Return a function in the context of 'self'                                                
                        self.draw();                
                    }
                })(this),
                i*1000     //normal interval, 'this' scope not impacted here.
            );         
        }        
                
    }

    getDataFromAudio(){
        //analyser.fftSize = 2048;
        var freqByteData = new Uint8Array(this.analyser.fftSize/2);
        var timeByteData = new Uint8Array(this.analyser.fftSize/2);
        this.analyser.getByteFrequencyData(freqByteData);
        this.analyser.getByteTimeDomainData(timeByteData);

        return {f:freqByteData, t:timeByteData}; // array of all 1024 levels
    }    

    draw(){
        
        // console.log(this.audio.currentTime);
        // this.audio.currentTime += 2;
        // console.log(this.audio.currentTime);
        // this.source.currentTime = this.audio.currentTime;
        // console.log('draw');
        var data = this.getDataFromAudio(); // {f:array, t:array}
        // console.log(data);

        let currentTime = this.audio.currentTime;
        var waveSum = 0;
        //draw live waveform and oscilloscope
        for (let i = 0; i<data.f.length; i++) {
            waveSum += data.f[i]; //add current bar value (max 255)
        }
        // if ((currentTime*10) > (this.lastTime + 1)) {
        this.lastTime = currentTime;
        this.amplitudes.push(waveSum/data.f.length);
        this.times.push(currentTime);
        console.log(currentTime);
        // }
    }

    
    togglePlayer(pause) {
        this.isPlaying = !pause;
        
        if(pause){
            // this.audioFile2.play();
          this.player.pause();
        } else {
            // this.audioFile2.pause();
          this.player.play();
        }
    }
    
    /*seek() {
        // var chartDiv = document.getElementsByClassName('container')[0];

        let newValue = this.chartDiv.scrollLeft;        
        console.log(newValue);
        console.log(newValue/(this.scale*(this.barWidth + this.marginWidth)));
        // let duration = this.player.duration();
        // this.player.seek(newValue/(this.scale*(this.barWidth + this.marginWidth)));
        this.audioFile2.seekTo(1000*newValue/(this.scale*(this.barWidth + this.marginWidth)));
        this.touching = false;
    }
    
    updateProgress() {
        let seek = this.player.seek();

        // this.progress = (seek / this.player.duration()) * 100 || 0;

        // let chartDiv = document.getElementsByClassName('container')[0]; 
        if(!this.touching){                   
            this.chartDiv.scrollLeft = seek * this.scale * (this.barWidth + this.marginWidth);            
        }  

        let sec = this.chartDiv.scrollLeft/(this.scale*(this.barWidth + this.marginWidth));
        this.formattedTime = this.getHour(sec) + ":" + this.getMinutes(sec) + ":" + this.getSeconds(sec) + "." + this.getMillis(sec);

        if(this.index < this.sentencesStart.length && sec >= this.sentencesStart[this.index+1]){
            this.index++;
        }

        if(this.index > 0 && sec < this.sentencesStart[this.index]){
            this.index--;
        }

        this.timeout = setTimeout(() => {
          this.updateProgress();
        }, 10);
    }*/

    seek() {
        let newValue = +this.range.value;
        let duration = this.player.duration();
        this.player.seek(duration * (newValue/100));
        this.touching = false;
    }
    
    updateProgress() {
        let seek = this.player.seek();  
        
        if(!this.touching){ 
            this.progress = (seek / this.player.duration()) * 100 || 0;
        }

        let sec = this.progress * this.player.duration() / 100;
        this.formattedTime = this.getHour(sec) + ":" + this.getMinutes(sec) + ":" + this.getSeconds(sec) + "." + this.getMillis(sec);

        if(this.index < this.sentencesStart.length && sec >= this.sentencesStart[this.index+1]){
            this.index++;
        }

        if(this.index > 0 && sec < this.sentencesStart[this.index]){
            this.index--;
        }

        this.timeout = setTimeout(() => {
          this.updateProgress();
        }, 100);
    }

}
