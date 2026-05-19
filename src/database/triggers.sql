DELIMITER $$

CREATE TRIGGER tg_validar_insercao_reserva
BEFORE INSERT ON Reservas
FOR EACH ROW
BEGIN
    DECLARE total_conflitos INT;

    IF NEW.data_inicio < NOW() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Erro: Não é possível fazer uma reserva no passado.';
    END IF;
    
    IF NEW.data_fim <= NEW.data_inicio THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Erro: A data de fim deve ser posterior à data de início.';
    END IF;

    SELECT COUNT(*) INTO total_conflitos
    FROM Reservas
    WHERE sala_id = NEW.sala_id
      AND status = 'Ativa'
      AND NEW.data_inicio < data_fim 
      AND NEW.data_fim > data_inicio;

    IF total_conflitos > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Erro: A sala já está reservada para este período.';
    END IF;
END$$

DELIMITER $$

CREATE TRIGGER tg_validar_atualizacao_reserva
BEFORE UPDATE ON Reservas
FOR EACH ROW
BEGIN
	
    DECLARE total_conflitos INT; 

    IF NEW.data_inicio <> OLD.data_inicio OR NEW.data_fim <> OLD.data_fim THEN

        IF NEW.data_inicio < NOW() THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erro: Não é possível alterar a reserva para uma data no passado.';
        END IF;
        
        IF NEW.data_fim <= NEW.data_inicio THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erro: A data de fim deve ser posterior à data de início.';
        END IF;
    END IF;
        
    IF NEW.sala_id <> OLD.sala_id OR NEW.data_inicio <> OLD.data_inicio OR NEW.data_fim <> OLD.data_fim OR NEW.status <> OLD.status THEN
        
        SELECT COUNT(*) INTO total_conflitos
        FROM Reservas
        WHERE sala_id = NEW.sala_id
          AND status = 'Ativa'
          AND id <> NEW.id
          AND NEW.data_inicio < data_fim 
          AND NEW.data_fim > data_inicio;

        IF total_conflitos > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erro: A sala já está reservada para este período.';
        END IF;
    END IF;
END$$

DELIMITER ;