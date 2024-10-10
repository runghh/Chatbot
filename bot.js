const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

// Serviço de leitura do QR code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Após isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializa tudo
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Contatos por loja
const contatosPorLoja = {
    'Palmas': {
        'comercial': ' _*Vendedores Palmas:*_\n\n👤 Evania\n wa.me/+556384533618\n\n👤 Glaucilane\n wa.me/+556384567199\n\n👤 Iago\n wa.me/+556384565940\n\n👤 Vitoria\n wa.me/+556392452567\n\n👤 Manoel\n wa.me/+556392578159\n\n👤 Diogo\n wa.me/+556384536266',
        'financeiro': '_*Financeiro Palmas:*_\n\n💰 Financeiro\n wa.me/+556384544708'
    },
    'Araguaína': {
        'comercial': '_*Vendedores Araguaína:*_\n\n👤 Antonio\n wa.me/+556392778886\n\n👤 Edpo\n wa.me/+556392345717\n\n👤 Jessica\n wa.me/+556391029185\n\n👤 Daniele\n wa.me/+556391029940',
        'financeiro': '_*Financeiro Araguaína:*_\n\n💰 Financeiro\n wa.me/+556391027885'
    },
    'Gurupi': {
        'comercial': '_*Vendedores Gurupi:*_\n\n👤 Raquel\n wa.me/+556392957918\n\n👤 Zé Ricardo\n wa.me/+556392957840',
        'financeiro': '_*Financeiro Gurupi:*_\n\n💰 Financeiro\n wa.me/+556392953292'
    },
    'Imperatriz': {
        'comercial': '_*Vendedores Imperatriz:*_\n\n👤 Miguel\n wa.me/+559985077025\n\n👤 Bruna\n wa.me/+559985076973\n\n👤 Adson\n wa.me/+559985076993\n\n👤 Morgana\n wa.me/+559985076950\n\n👤 Willamy\n wa.me/+559991430388',
        'financeiro': '_*Financeiro Imperatriz:*_\n\n💰 Financeiro\n wa.me/+559981542859'
    },
    'São Luís': {
        'comercial': '_*Vendedores São Luís:*_\n\n👤 Nagila\n wa.me/+559884031242\n\n👤 Jessica\n wa.me/+559884026545',
        'financeiro': '_*Financeiro São Luís:*_\n\n💰 Financeiro\n wa.me/+559870076114'
    }
};

// Objeto para armazenar o estado da conversa de cada usuário
const userStates = {}; 
const userBusy = {}; // Novo objeto para controlar se o usuário está ocupado

client.on('message', async msg => {
    const chatId = msg.from;
    const chat = await msg.getChat();

    // Verifica se a mensagem é de um grupo
    if (chat.isGroup) {
        return; // Não faz nada se for de um grupo
    }

    // Verifica se o usuário está ocupado
    if (userBusy[chatId]) {
        return; // Não responde se o usuário já está em uma sessão
    }

    // Inicializar o estado do usuário se não existir
    if (!userStates[chatId]) {
        userStates[chatId] = 'inicio'; // Estado inicial
    }

    const currentState = userStates[chatId]; // Pegar o estado atual

    // Se o usuário digitar qualquer palavra, abre o menu
    if (currentState === 'inicio') {
        userBusy[chatId] = true; // Marca o usuário como ocupado
        const contact = await msg.getContact();
        const name = contact.pushname;
        await client.sendMessage(chatId, `👋 Olá, ${name.split(" ")[0]}!\n\n✅ Sou o *assistente virtual* da Digisat Distribuidora.\n\n ⏰ Atendimento de segunda a sexta, das 8h às 22h; sábado, das 8h às 12h \n\n🗣️ Com quem você deseja falar?`);
        await delay(2000);
        await client.sendMessage(chatId, `_*COMERCIAL e FINANCEIRO*_ \n\n*1* 👤 Palmas \n*2* 👤 Araguaína\n*3* 👤 Gurupi\n*4* 👤 Imperatriz\n*5* 👤 São Luís\n\n_*OUTRAS ÁREAS*_ \n\n*6* 🛍️ Compras\n*7* 🛠️ Suporte Técnico\n*8* 🗒️ Reclamações\n*9* 🙎 Kevin(Site) \n*10* 📱 Redes sociais\n\n_*digite uma das opções abaixo:*_`); 
        userStates[chatId] = 'escolhendo-loja'; 
        userBusy[chatId] = false; // Libera o usuário
        return;
    }

    // Se o estado for 'escolhendo-loja'
    if (currentState === 'escolhendo-loja') {
        let lojaEscolhida = '';
        switch (msg.body) {
            case '1':
                lojaEscolhida = 'Palmas';
                break;
            case '2':
                lojaEscolhida = 'Araguaína';
                break;
            case '3':
                lojaEscolhida = 'Gurupi';
                break;
            case '4':
                lojaEscolhida = 'Imperatriz';
                break;
            case '5':
                lojaEscolhida = 'São Luís';
                break;
            case '6':
                lojaEscolhida = 'Compras';
                await delay(3000);
                await client.sendMessage(chatId, `_*${lojaEscolhida}:*_\n\n👤 Lucas Alencar \n wa.me/+556391260181 \n\n👤 Lucas Borges \n wa.me/+556391261158`);
                await delay(3000);
                await client.sendMessage(chatId, '_Sessão finalizada._');
                userStates[chatId] = 'inicio';
                return;
            case '7':
                lojaEscolhida = 'Suporte técnico';
                await delay(3000);
                await client.sendMessage(chatId, `_*${lojaEscolhida}:*_\n\n👤 Assistência \n wa.me/+556384565749 \n\n👤 Nandin \n wa.me/+556384582000\n\n👤 Jean \n wa.me/+556384495697`);
                await delay(3000);
                await client.sendMessage(chatId, '_Sessão finalizada._');
                userStates[chatId] = 'inicio';
                return;
            case '8':
                lojaEscolhida = 'Qualidade';
                await delay(3000);
                await client.sendMessage(chatId, `_*${lojaEscolhida}:*_\n\n👤 Reclamações e Depoimentos \n wa.me/+556392529448`);
                await delay(3000);
                await client.sendMessage(chatId, '_Sessão finalizada._');
                userStates[chatId] = 'inicio';
                return;
            case '9':
                await delay(3000);
                await client.sendMessage(chatId, '👤 Você está falando com um atendente.\n _Digite (SAIR) para encerrar a conversa._'); 
                userStates[chatId] = 'atendente';
                return;
            case '10':
                await delay(3000);
                await client.sendMessage(chatId, `👤 Redes Sociais:\n\nInstagram \n instagram.com/digisatdistribuidora/\n\nFacebook \n facebook.com/DigisatDistribuidora \n\nYoutube \n youtube.com/DigisatDistribuidora \n\nTiktok \n tiktok.com/@digisatdistribuidora \n\nLinkedin \n br.linkedin.com/company/digisat-distribuidora`);
                await delay(3000);
                await client.sendMessage(chatId, '_Sessão finalizada._');
                userStates[chatId] = 'inicio';
                return;
            default:
                await client.sendMessage(chatId, '_*Opção inválida*. Por favor, escolha uma das opções válidas_');
                return;
        }

        // Se escolheu uma loja válida
        if (['1', '2', '3', '4', '5'].includes(msg.body)) {
            await client.sendMessage(chatId, `✅ Você escolheu a loja ${lojaEscolhida}.\n\n _Com qual área você deseja falar?_ \n\n*1* 👤 Comercial\n*2* 💰 Financeiro`);
            userStates[chatId] = { state: 'escolhendo-area', loja: lojaEscolhida }; // Salva a loja escolhida
            return;
        }
    }

    // Se o estado for 'escolhendo-area'
    if (currentState.state === 'escolhendo-area') {
        const loja = currentState.loja; // Pega a loja escolhida

        await delay(3000); // Aguarda um tempo

        if (msg.body === '1') {
            await client.sendMessage(chatId, contatosPorLoja[loja].comercial);
            await delay(3000);
            await client.sendMessage(chatId, '_Sessão finalizada._');
            userStates[chatId] = 'inicio'; // Reseta o estado do usuário
            return;
        } else if (msg.body === '2') {
            await client.sendMessage(chatId, contatosPorLoja[loja].financeiro);
            await delay(3000);
            await client.sendMessage(chatId, '_Sessão finalizada._');
            userStates[chatId] = 'inicio'; // Reseta o estado do usuário
            return;
        } else {
            await client.sendMessage(chatId, '_*Opção inválida*. Por favor, escolha uma das opções válidas_');
            return;
        }
    }

    // Para encerrar a sessão
    if (msg.body.toUpperCase() === 'SAIR') {
        await client.sendMessage(chatId, '_Sessão encerrada. Para reiniciar, envie qualquer mensagem._');
        userStates[chatId] = 'inicio'; // Reseta o estado do usuário
        userBusy[chatId] = false; // Libera o usuário
    }
});
