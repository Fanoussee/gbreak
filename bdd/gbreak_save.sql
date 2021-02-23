-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: gbreak
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article` (
  `id_article` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_util` smallint unsigned NOT NULL,
  `date_heure` datetime NOT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `texte` text,
  `uuid_util` varchar(50) NOT NULL,
  `uuid_article` varchar(50) NOT NULL,
  PRIMARY KEY (`id_article`),
  UNIQUE KEY `uuid_article` (`uuid_article`),
  UNIQUE KEY `uuid_article_2` (`uuid_article`),
  KEY `fk_id_util` (`id_util`),
  KEY `fk_uuid_util` (`uuid_util`),
  CONSTRAINT `fk_id_util` FOREIGN KEY (`id_util`) REFERENCES `utilisateur` (`id_util`) ON UPDATE CASCADE,
  CONSTRAINT `fk_uuid_util` FOREIGN KEY (`uuid_util`) REFERENCES `utilisateur` (`uuid_util`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (179,71,'2021-02-23 18:47:55','http://localhost:3000/images/Flan_pâtissier1614102475412.jpg',' - 1 pâte brisée\n - 4 oeufs\n - 1L de lait\n - 150g de sucre\n - 90g de maïzena\n - 1 gousse de vanille\n\nFaire bouillir le lait avec la gousse de vanille fendue (dans le sens de la longueur).\nPendant ce temps, mélanger la Maïzena (tamisée, c\'est mieux) avec le sucre et ajouter les oeufs bien battus.\nMélanger le tout (bien homogène) et ajouter le lait bouillant (sans la gousse).\nCuire la préparation à feu doux sans cesser de remuer pendant environ 1 à 2 min.\nPréchauffer le four à 200°C (thermostat 6-7).\nFoncer un plat rectangulaire ou rond préalablement beurré avec la pâte brisée.\nPiquer le fond.\nY verser la préparation.\nLisser la surface.\nCuire pendant environ 30 à 40 min.\nLaisser refroidir avant de déguster.','a89c8ac8-591a-4a14-8380-d06e0a104a29','1fb06da8-540d-4733-bdca-9d6fad684f15'),(180,73,'2021-02-23 18:48:40',NULL,'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam minima provident maiores, dicta cupiditate porro cum debitis itaque deserunt fugit? Soluta eum placeat ducimus illum ex quisquam, minima inventore facere!','42acb590-836d-4c4e-bb25-1730bbe54820','14d1da33-9787-49d7-8839-803aa9422ec4'),(181,74,'2021-02-23 18:53:35','http://localhost:3000/images/L\'Ile_de_la_Réunion1614102815025.jpg',NULL,'dc8be01a-7641-4f56-8cd2-a6d6e561cec9','7ac93474-5d25-4c8a-9cbc-9cb467969177');
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commentaire`
--

DROP TABLE IF EXISTS `commentaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commentaire` (
  `id_commentaire` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_util` smallint unsigned NOT NULL,
  `id_article` bigint unsigned NOT NULL,
  `date_commentaire` datetime NOT NULL,
  `commentaire` text NOT NULL,
  `uuid_util` varchar(50) NOT NULL,
  `uuid_article` varchar(50) NOT NULL,
  `uuid_commentaire` varchar(50) NOT NULL,
  PRIMARY KEY (`id_commentaire`),
  UNIQUE KEY `uuid_commentaire` (`uuid_commentaire`),
  KEY `fk_id_util_commentaire` (`id_util`),
  KEY `fk_id_article` (`id_article`),
  KEY `fk_uuid_util_commentaire` (`uuid_util`),
  KEY `fk_uuid_article` (`uuid_article`),
  CONSTRAINT `fk_id_article` FOREIGN KEY (`id_article`) REFERENCES `article` (`id_article`) ON DELETE CASCADE,
  CONSTRAINT `fk_id_util_commentaire` FOREIGN KEY (`id_util`) REFERENCES `utilisateur` (`id_util`) ON UPDATE CASCADE,
  CONSTRAINT `fk_uuid_article` FOREIGN KEY (`uuid_article`) REFERENCES `article` (`uuid_article`) ON DELETE CASCADE,
  CONSTRAINT `fk_uuid_util_commentaire` FOREIGN KEY (`uuid_util`) REFERENCES `utilisateur` (`uuid_util`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentaire`
--

LOCK TABLES `commentaire` WRITE;
/*!40000 ALTER TABLE `commentaire` DISABLE KEYS */;
INSERT INTO `commentaire` VALUES (67,74,180,'2021-02-23 18:53:55','Désolée Claire mais on ne comprends pas le latin !','dc8be01a-7641-4f56-8cd2-a6d6e561cec9','14d1da33-9787-49d7-8839-803aa9422ec4','a27dcf62-2ed0-41b0-b1d4-8eedf9f8e7f3'),(68,1,179,'2021-02-23 18:54:31','Merci pour la recette.','afeda077-f648-443e-a753-79c3b9cb7a35','1fb06da8-540d-4733-bdca-9d6fad684f15','07e70356-7d32-4829-a9b5-eb57a22a314e'),(69,71,179,'2021-02-23 18:55:07','Je vous en prie M. LAFFAITEUR.','a89c8ac8-591a-4a14-8380-d06e0a104a29','1fb06da8-540d-4733-bdca-9d6fad684f15','9c8ec9de-6b79-4180-a776-9eee41bb5a9c'),(70,73,180,'2021-02-23 18:55:31','Mais je sais Sylvie, c\'est juste pour l\'exemple.','42acb590-836d-4c4e-bb25-1730bbe54820','14d1da33-9787-49d7-8839-803aa9422ec4','a1e14972-71a9-476c-863e-9053a5d40597'),(71,74,180,'2021-02-23 18:55:50','Ah ouais...','dc8be01a-7641-4f56-8cd2-a6d6e561cec9','14d1da33-9787-49d7-8839-803aa9422ec4','6f39921d-a8e8-4481-a472-dca0047e1ac4'),(72,74,181,'2021-02-23 18:56:05','Je suis revenue toute bronzée !','dc8be01a-7641-4f56-8cd2-a6d6e561cec9','7ac93474-5d25-4c8a-9cbc-9cb467969177','c06d78df-bae6-4323-9100-16ca9a301145'),(73,1,181,'2021-02-23 18:56:28','Ah oui, ça on avait remarqué !','afeda077-f648-443e-a753-79c3b9cb7a35','7ac93474-5d25-4c8a-9cbc-9cb467969177','6fa267d4-7d0d-4c69-a74d-5c70cf86d196'),(74,72,179,'2021-02-23 18:57:19','Moi aussi je l\'ai essayé, c\'est trop bon !','3726f406-4977-4a79-bc57-b129140220d0','1fb06da8-540d-4733-bdca-9d6fad684f15','e4a7ba6d-7f8a-463f-85e3-ab14e6044539'),(75,71,179,'2021-02-23 18:57:40','Le flan c\'est ma passion !','a89c8ac8-591a-4a14-8380-d06e0a104a29','1fb06da8-540d-4733-bdca-9d6fad684f15','7a958d85-edac-4bee-a823-27713bb4377c');
/*!40000 ALTER TABLE `commentaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id_util` smallint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `date_naiss` datetime NOT NULL,
  `mot_passe` varchar(100) NOT NULL,
  `moderateur` tinyint unsigned NOT NULL DEFAULT '0',
  `uuid_util` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id_util`),
  UNIQUE KEY `nom_prenom_date_naiss` (`nom`,`prenom`,`date_naiss`),
  UNIQUE KEY `uuid_util` (`uuid_util`),
  UNIQUE KEY `uuid_util_2` (`uuid_util`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (0,'supprimé','utilisateur','1900-01-01 00:00:00','$2b$10$CacWEDZbzTOMNoTuwCzLsOSR0FG9sdaOkgMFPZKA1X5ndRBXzZuQ6',0,'25eddd5c-c805-4368-9174-91a04997884d','nonemail'),(1,'LAFFAITEUR','Christophe','1965-07-15 00:00:00','$2b$10$DKCqZlJd5HjY1snb5sW0RepGdrGEGYlVc8tdwwb5p797DKIDEbg72',1,'afeda077-f648-443e-a753-79c3b9cb7a35','christophe.laffaiteur@gmail.com'),(71,'AYALA','Régine','1963-06-30 00:00:00','$2b$10$BTtkIEJgGUaLuX0a/sZwmOiBhZgZOpCC5tCQSLYoaVBs2to5UN4bO',0,'a89c8ac8-591a-4a14-8380-d06e0a104a29','regine.ayala@gmail.com'),(72,'LAURENT','Céline','1991-01-18 00:00:00','$2b$10$FSC8YZ9ebn5.kybcsWcRgeqS8I.Wwri..OvTT/0Cww0cnD0fQOF1u',0,'3726f406-4977-4a79-bc57-b129140220d0','celine.laurent@gmail.com'),(73,'MESLONG','Claire','1979-08-13 00:00:00','$2b$10$7xHCpym7Bp3UjdHLWXlm2Ozbms30MuiBt8FNfFSg/0dlecucMdz/e',0,'42acb590-836d-4c4e-bb25-1730bbe54820','claire.meslong@gmail.com'),(74,'PELISSIER','Sylvie','1972-03-21 00:00:00','$2b$10$qfoVUJ3qpXOx60QmwlT7LuUB/2QE4vwMopcwXxfeGZJtxmVr5L7Ue',0,'dc8be01a-7641-4f56-8cd2-a6d6e561cec9','sylvie.pelissier@gmail.com');
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-23 19:02:40
