# Livreiro

PhD Work for Collective Intelligence Class (2020).

O aplicativo é destinado a dispositivos móveis por já serem dispositivos amplamente utilizados e cada vez mais acessíveis. O aplicativo permite acesso a um sistema de Crowdsourcing a partir da competição implementando as seguintes funcionalidades:

- os usuários gravarem e enviarem suas interpretações de um fragmento de texto para se candidatar a ser ator em um determinado audiolivro;
- os usuários votarem nos usuários que se candidataram e enviaram uma amostra de áudio para o sistema.

## Library ([home.page.ts](https://github.com/eliaslawrence/livreiro/blob/main/src/app/home/home.page.ts))

<p align="center">
    <img src="/imgs/library.png" width="300">
</p>

## Player ([player.page.ts](https://github.com/eliaslawrence/livreiro/blob/main/src/app/player/player.page.ts))

<p align="center">
    <img src="/imgs/player.png" width="300">
</p>

Esta figura mostra a interface também com as informações da obra na parte superior, em que um usuário pode votar no usuário que deseja para atuar na obra.

## Recorder ([recorder.page.ts](https://github.com/eliaslawrence/livreiro/blob/main/src/app/recorder/recorder.page.ts))

<p align="center">
    <img src="/imgs/recorder.png" width="300">
</p>

A figura mostra a interface de gravação do áudio para um usuário de candidatar a atuação. Nesta imagem é exibido o título da obra, o personagem a ser gravado, o texto escrito a ser interpretado e os botões de controle de play, rec e pause.

Quando um usuário se candidata a participar do elenco de alguma obra de audiolivro, a gravação deve ser feita através da interface da figura e, logo após, devem ser feitas as marcações de final de frase, isto é, a segmentação do áudio. Assim, a partir do áudio gravado juntamente com a marcação dos intervalos entre uma frase e outra é possível obter a separação entre as frases com maior acurácia quando comparada a algoritmos que desempenhem essa mesma função. Consequentemente, os dados resultantes podem ser usados para o desenvolvimento de aplicações TTS.