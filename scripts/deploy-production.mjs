import { spawnSync } from 'node:child_process';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
    shell: options.shell ?? false,
  });

  if (result.error) {
    console.error(`Falha ao executar ${command}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    if (options.capture) {
      process.stderr.write(result.stderr || result.stdout || '');
    }
    process.exit(result.status ?? 1);
  }

  return (result.stdout || '').trim();
}

const git = (args) => run('git', args, { capture: true });

const branch = git(['branch', '--show-current']);
if (branch !== 'main') {
  console.error(`Deploy bloqueado: a branch atual é "${branch}", não "main".`);
  process.exit(1);
}

const status = git(['status', '--porcelain']);
if (status) {
  console.error('Deploy bloqueado: existem alterações locais sem commit.');
  console.error(status);
  console.error('Faça commit e push antes de publicar em produção.');
  process.exit(1);
}

console.log('Sincronizando referências com origin/main...');
run('git', ['fetch', 'origin', 'main']);

const localHead = git(['rev-parse', 'HEAD']);
const remoteHead = git(['rev-parse', 'origin/main']);
if (localHead !== remoteHead) {
  console.error('Deploy bloqueado: a branch local diverge de origin/main.');
  console.error(`Local:  ${localHead}`);
  console.error(`Remoto: ${remoteHead}`);
  console.error('Sincronize e envie os commits antes de publicar.');
  process.exit(1);
}

console.log('Árvore limpa e sincronizada. Iniciando deploy de produção...');
const extraArgs = process.argv.slice(2);
const autoConfirm = extraArgs.includes('--yes') || extraArgs.includes('-y') ? [] : ['--yes'];
run('npx', ['--yes', 'vercel@54.14.2', '--prod', ...autoConfirm, ...extraArgs], {
  shell: process.platform === 'win32',
});
