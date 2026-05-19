CREATE TABLE Instituicoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL UNIQUE,
  rua VARCHAR(100) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  bairro VARCHAR(50) NOT NULL,
  cidade VARCHAR(50) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  telefone VARCHAR(20) NOT NULL
);

CREATE TABLE Usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  rua VARCHAR(100) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  bairro VARCHAR(50) NOT NULL,
  cidade VARCHAR(50) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  tipo ENUM('admin','professor') NOT NULL,
  instituicao_id INT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_instituicao_user 
    FOREIGN KEY (instituicao_id) REFERENCES Instituicoes(id)
    ON DELETE CASCADE
);

CREATE TABLE Salas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo ENUM('Sala de aula', 'Auditório', 'Laboratório') NOT NULL,
  capacidade INT NOT NULL,
  instituicao_id INT NOT NULL,
  CONSTRAINT fk_instituicao_sala 
    FOREIGN KEY (instituicao_id) REFERENCES Instituicoes(id)
    ON DELETE CASCADE
);

CREATE TABLE Reservas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sala_id INT NOT NULL,
  usuario_id INT,
  data_inicio DATETIME NOT NULL,
  data_fim DATETIME NOT NULL,
  status ENUM('Ativa' , 'Cancelada'),
  CONSTRAINT fk_reserva_usuario 
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_sala_reserva 
    FOREIGN KEY (sala_id) REFERENCES Salas(id)
    ON DELETE CASCADE
);