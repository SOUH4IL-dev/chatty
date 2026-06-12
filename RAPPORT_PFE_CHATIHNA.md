<table style="width: 100%; border: none; border-collapse: collapse;">
  <tr style="border: none;">
    <td style="width: 50%; text-align: left; border: none; padding: 0;">
      <strong>SOLICODE - Centre de Formation</strong><br>
      Filière : Développement Web et Mobile
    </td>
    <td style="width: 50%; text-align: right; border: none; padding: 0;">
      <strong>OFPPT</strong><br>
      Année Académique : 2025 / 2026
    </td>
  </tr>
</table>

<br><br><br>

<div align="center">
  <br>
  <p style="font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;">Projet de Fin d'Études (PFE)</p>
  
  <hr style="width: 100%; border: 1px solid #ddd; margin: 20px 0;" />
  
  <h1 style="font-size: 28px; line-height: 1.3; margin: 20px 0; font-family: 'Montserrat', sans-serif;">
    <strong>CHATIHNA</strong><br>
    <span style="font-size: 18px; font-weight: normal; color: #555;">Plateforme de Messagerie Instantanée et d'Appels en Temps Réel</span>
  </h1>
  
  <hr style="width: 100%; border: 1px solid #ddd; margin: 20px 0;" />
  
  <br><br>
  
  [Insérer ici le logo officiel de SOLICODE / OFPPT]
  
  <br><br><br><br>
  
  <table style="width: 80%; margin: 0 auto; border: none; border-collapse: collapse;">
    <tr style="border: none;">
      <td style="width: 50%; text-align: left; border: none; padding: 10px;">
        <strong>Présenté par :</strong><br>
        SOUH4IL-dev
      </td>
      <td style="width: 50%; text-align: right; border: none; padding: 10px;">
        <strong>Encadré par :</strong><br>
        [Nom de l'encadrante]
      </td>
    </tr>
  </table>
  
  <br><br><br><br>
  
  <p style="font-size: 12px; color: #777;">Tanger, Maroc — Juin 2026</p>
</div>

<div style="page-break-after: always;"></div>

# Remerciements

Ce projet de fin d'études a pu être mené à bien grâce au soutien, aux conseils et à la collaboration de nombreuses personnes. Il convient d'exprimer une profonde gratitude envers tous ceux qui ont contribué, directement ou indirectement, à sa réalisation.

Des remerciements sincères sont adressés à l'encadrante pédagogique pour ses conseils précieux, sa disponibilité et son accompagnement constructif tout au long de ce travail. Ses orientations méthodologiques et son expertise ont permis de guider le développement de ce projet dans les meilleures conditions.

Une vive reconnaissance est également exprimée envers l'administration et le corps professoral de SOLICODE pour la qualité des enseignements dispensés et l'excellence des ressources matérielles et techniques mises à disposition. L'environnement d'apprentissage stimulant a grandement facilité l'accomplissement de ce travail.

L'équipe tient à saluer l'ensemble des formateurs pour le partage de leurs connaissances techniques et leur engagement professionnel, qui ont posé les bases théoriques et pratiques indispensables à la réalisation de cette application.

Enfin, toute notre gratitude va à nos familles et proches pour leur soutien constant et leurs encouragements indéfectibles tout au long de ce parcours de formation.

---

# Résumé

Chatihna est une plateforme de messagerie instantanée en temps réel conçue pour offrir une expérience de communication fluide, moderne et sécurisée. Développée dans le cadre du Projet de Fin d'Études à SOLICODE / OFPPT, l'application répond au besoin croissant d'outils de communication centralisés, performants et respectueux de la vie privée.

L'architecture technique repose sur un stack JavaScript full-stack : **Next.js 16** avec le App Router pour le frontend, **Express 5** pour le backend, **MongoDB** avec Mongoose pour la persistance des données, et **Socket.IO** pour la communication bidirectionnelle en temps réel. L'authentification est gérée exclusivement par **Firebase Auth**, permettant une connexion sécurisée par email/mot de passe ou via Google OAuth.

Les fonctionnalités clés incluent la messagerie textuelle instantanée, l'envoi de messages vocaux, les appels audio/vidéo via WebRTC, la modification et la suppression de messages, la gestion des profils utilisateurs, ainsi qu'un système de présence en ligne/ hors ligne. L'interface utilisateur, développée avec **Tailwind CSS v4** et **Framer Motion**, offre une expérience visuelle sombre et épurée avec des animations fluides.

Ce rapport détaille l'ensemble du processus de conception, de développement et de déploiement de Chatihna, en mettant l'accent sur les choix architecturaux, les défis techniques relevés et les perspectives d'évolution.

---

# Chapitre 1 : Contexte et État de l'Art

## 1.1 Introduction Générale

À l'ère du numérique, la communication instantanée est devenue un pilier fondamental des interactions humaines, tant sur le plan personnel que professionnel. Les applications de messagerie occupent une place centrale dans notre quotidien, avec des milliards d'utilisateurs actifs à travers le monde. WhatsApp, Messenger, Telegram, Slack et Discord sont autant d'exemples qui illustrent l'importance cruciale de ces outils.

Cependant, malgré la multitude d'options disponibles, de nombreuses solutions présentent des limitations significatives : dépendance à des écosystèmes fermés, collecte excessive de données personnelles, latence dans la livraison des messages, ou encore interfaces surchargées qui nuisent à l'expérience utilisateur.

C'est dans ce contexte que le projet Chatihna a vu le jour. L'objectif est de développer une application de messagerie instantanée qui combine performance, simplicité et respect de la vie privée, tout en exploitant les technologies web les plus récentes pour offrir une expérience utilisateur premium.

## 1.2 Problématique

Les outils de communication traditionnels souffrent de plusieurs lacunes :

1. **Lenteur et latence** : De nombreuses applications ne garantissent pas une livraison instantanée des messages, ce qui nuit à la fluidité des échanges.

2. **Manque de centralisation** : Les utilisateurs jonglent souvent entre plusieurs applications pour différents types de communication (messages texte, appels audio, partage de fichiers), fragmentant ainsi leur expérience.

3. **Sécurité et vie privée** : La plupart des solutions propriétaires collectent et exploitent les données des utilisateurs à des fins commerciales, soulevant des préoccupations légitimes en matière de confidentialité.

4. **Complexité d'utilisation** : De nombreuses applications accumulent des fonctionnalités au fil du temps, créant des interfaces surchargées qui nuisent à l'expérience utilisateur.

5. **Absence de standardisation** : Les protocoles propriétaires empêchent l'interopérabilité entre les différentes plateformes.

Chatihna répond à ces problématiques en proposant une solution légère, rapide et sécurisée, avec une architecture moderne garantissant la transmission en temps réel des messages.

## 1.3 Objectifs du Projet

Les objectifs fondamentaux du projet Chatihna sont :

- **Offrir une expérience utilisateur fluide** : Interface minimaliste, navigation intuitive, animations soignées et thème sombre pour un confort visuel optimal.

- **Garantir la réception des messages en temps réel** : Utilisation de WebSockets avec Socket.IO pour une communication bidirectionnelle sans latence.

- **Sécuriser les échanges** : Authentification Firebase avec tokens JWT, validation côté serveur, protection des routes API.

- **Permettre la communication multimodale** : Messages texte, messages vocaux enregistrés directement depuis le navigateur, appels audio et vidéo via WebRTC.

- **Assurer la disponibilité multiplateforme** : Application web progressive (PWA) compatible avec tous les navigateurs modernes.

## 1.4 Solution Proposée : Chatihna

Chatihna se présente comme une application web de messagerie instantanée complète, accessible depuis n'importe quel navigateur moderne. L'application offre :

- Un système d'authentification sécurisé avec deux méthodes (email/mot de passe et Google OAuth)
- Une liste de contacts avec recherche intégrée
- Des salons de discussion individuels (messagerie privée)
- Un système de messagerie en temps réel avec accusés de réception (vu/non vu)
- L'enregistrement et l'envoi de messages vocaux
- Les appels audio et vidéo via WebRTC
- La modification et la suppression de messages
- Un système de présence (en ligne/hors ligne)
- Une page de paramètres complète avec modification du profil, de l'email et du mot de passe
- Une interface responsive avec thème sombre

## 1.5 État de l'Art

### Solutions Existantes

| Solution | Type | Temps Réel | Open Source | Appels | Messages Vocaux |
|----------|------|------------|-------------|--------|-----------------|
| WhatsApp Web | Propriétaire | ✓ | ✗ | ✓ (limité) | ✓ |
| Telegram Web | Propriétaire | ✓ | ✗ | ✓ | ✓ |
| Slack | Professionnel | ✓ | ✗ | ✗ | ✓ |
| Discord | Communautaire | ✓ | ✗ | ✓ | ✓ |
| **Chatihna** | **Éducatif** | **✓** | **✓** | **✓ (WebRTC)** | **✓** |

### Valeur Ajoutée de Chatihna

- **Architecture full JavaScript** : Stack homogène (Next.js + Node.js) facilitant la maintenance et l'évolution.
- **Authentification Firebase uniquement** : Pas de gestion manuelle des mots de passe, sécurité déléguée à Firebase Auth.
- **Interface ultra-minimaliste** : Design épuré sans surcharge visuelle, thème sombre par défaut.
- **WebRTC intégré** : Appels audio/vidéo peer-to-peer sans infrastructure supplémentaire.
- **Code source ouvert** : Transparence totale, possibilité d'audit de sécurité et de contributions communautaires.

## 1.6 Planification du Projet

Le projet a été réalisé selon les phases suivantes :

1. **Analyse des besoins** (1 semaine) : Définition des fonctionnalités, identification des acteurs, spécifications techniques.
2. **Conception** (1 semaine) : Modélisation de la base de données, conception des interfaces, schéma d'architecture.
3. **Développement Backend** (2 semaines) : Mise en place du serveur Express, API RESTful, base de données MongoDB, Socket.IO.
4. **Développement Frontend** (3 semaines) : Intégration Next.js, composants React, connexion à l'API, gestion d'état.
5. **Tests et Déploiement** (1 semaine) : Tests fonctionnels, correction de bugs, préparation au déploiement (Vercel).

---

# Chapitre 2 : Analyse des Besoins

## 2.1 Identification des Acteurs

Pour structurer l'analyse et la modélisation des processus du système Chatihna, deux acteurs principaux ont été identifiés avec leurs permissions et responsabilités respectives :

### 2.1.1 Utilisateur Final (Utilisateur Authentifié)
Il s'agit de l'acteur principal qui consomme les services applicatifs de communication :
- **Gestion de compte** : Inscription via email, connexion sécurisée et réinitialisation de mot de passe.
- **Messagerie** : Envoi, modification et suppression de messages texte, vocaux (enregistrés à la volée) et d'images.
- **Conversations** : Création automatique ou suppression de conversations privées bidirectionnelles.
- **Contacts** : Recherche et consultation de l'annuaire des utilisateurs, ainsi que la vérification de leur état de présence en temps réel.
- **Appels** : Lancement et réception d'appels audio et vidéo en peer-to-peer (P2P).
- **Profil** : Mise à jour des informations personnelles (nom d'affichage, adresse email, mot de passe, avatar personnalisé).
- **Notifications** : Réception visuelle et sonore d'alertes à l'arrivée de nouveaux messages ou d'appels entrants.

### 2.1.2 Modérateur / Administrateur
Bien que le prototype applicatif soit centré sur les échanges P2P, le modèle d'architecture intègre le rôle d'administration système :
- **Supervision infrastructure** : Analyse et gestion des identités à travers la console Firebase Auth.
- **Modération et sécurité** : Désactivation manuelle ou suspension des comptes contrevenant aux conditions d'utilisation.
- **Maintenance et nettoyage** : Capacité de purge directe des messages obsolètes ou des documents orphelins via MongoDB Atlas afin d'optimiser l'espace de stockage.
- **Gestion des ressources cloud** : Configuration et supervision des quotas de stockage de médias sur Cloudinary et des connexions simultanées.

## 2.2 Besoins Fonctionnels

### Gestion des Comptes (Module d'Authentification)
- **F-01** : Inscription par email et mot de passe avec vérification
- **F-02** : Connexion par email/mot de passe avec gestion des erreurs Firebase
- **F-03** : Connexion via Google OAuth (popup)
- **F-04** : Réinitialisation du mot de passe par email
- **F-05** : Déconnexion sécurisée
- **F-06** : Mise à jour du profil (nom, photo)
- **F-07** : Changement d'email avec ré-authentification
- **F-08** : Changement de mot de passe avec ré-authentification et vérification de l'ancien mot de passe

### Gestion des Messages (Module de Chat)
- **F-09** : Envoi de messages texte en temps réel
- **F-10** : Enregistrement et envoi de messages vocaux (via MediaRecorder API)
- **F-11** : Réception instantanée des messages (Socket.IO)
- **F-12** : Affichage des messages avec horodatage
- **F-13** : Accusés de réception (messages vus/non vus)
- **F-14** : Modification de messages (édition)
- **F-15** : Suppression de messages
- **F-16** : Marquage des messages comme lus
- **F-17** : Recherche dans les messages

### Gestion des Conversations
- **F-18** : Création automatique d'une conversation lors du premier message
- **F-19** : Liste des conversations triées par date du dernier message
- **F-20** : Affichage du dernier message dans l'aperçu de la conversation
- **F-21** : Suppression d'une conversation complète

### Gestion des Contacts
- **F-22** : Liste de tous les utilisateurs inscrits
- **F-23** : Recherche d'utilisateurs par nom ou email
- **F-24** : Affichage du statut en ligne/hors ligne

### Appels Audio/Vidéo (Module de Communication)
- **F-25** : Initiation d'appel audio (WebRTC)
- **F-26** : Initiation d'appel vidéo (WebRTC)
- **F-27** : Réception et acceptation/refus d'appel entrant
- **F-28** : Gestion des flux média (micro, caméra)
- **F-29** : Communication peer-to-peer via ICE candidates et STUN server
- **F-30** : Fin d'appel

### Interface Utilisateur
- **F-31** : Navigation avec barre latérale (chats, contacts, alertes, paramètres)
- **F-32** : Affichage des notifications de nouveaux messages (Web API Notification)
- **F-33** : Sons de notification pour les messages et les appels
- **F-34** : Sélecteur d'émojis pour les messages
- **F-35** : Animations fluides (Framer Motion)

## 2.3 Besoins Non Fonctionnels

### Performance (Temps Réel Strict)
- **NF-01** : La latence de livraison des messages ne doit pas dépasser 200 ms dans des conditions normales de réseau.
- **NF-02** : Le temps de chargement initial de l'application doit être inférieur à 2 secondes.
- **NF-03** : L'application doit supporter au moins 50 connexions Socket.IO simultanées.

### Sécurité des Données
- **NF-04** : L'authentification est déléguée à Firebase Auth — aucun mot de passe n'est stocké dans la base de données.
- **NF-05** : Toutes les requêtes API sont protégées par un token Firebase vérifié côté serveur (Firebase Admin SDK).
- **NF-06** : Les connexions Socket.IO sont authentifiées par token sur le handshake.
- **NF-07** : Les CORS sont restreints à l'origine du client (`CLIENT_URL`).
- **NF-08** : La validation des entrées est effectuée côté serveur (longueur des messages, format des données).

### Ergonomie et Responsivité
- **NF-09** : L'interface est entièrement responsive (mobile, tablette, desktop).
- **NF-10** : Le thème sombre est appliqué par défaut, sans choix de thème clair.
- **NF-11** : Les interactions utilisateur sont accompagnées de retours visuels (spinners, animations, messages d'erreur/succès).
- **NF-12** : Les messages audio sont lisibles avec un lecteur intégré.

### Maintenabilité du Code
- **NF-13** : L'architecture backend suit le pattern MVC (Modèle-Vue-Contrôleur).
- **NF-14** : Les composants frontend sont modularisés et réutilisables.
- **NF-15** : Les variables d'environnement centralisent la configuration sensible.
- **NF-16** : Le code est versionné avec Git et hébergé sur GitHub.

---

# Chapitre 3 : Conception du Système

## 3.1 Cas d'Utilisation Principaux

[CADRE VISUEL : Insérer ici le diagramme de cas d'utilisation (Use Case Diagram) - Centré avec légende : Figure 3.1 : Diagramme des cas d'utilisation généraux du système]

### Cas d'Utilisation 1 : S'authentifier

**Acteur :** Utilisateur non authentifié

**Précondition :** L'utilisateur n'est pas connecté.

**Scénario principal :**
1. L'utilisateur accède à la page d'accueil de Chatihna.
2. Il clique sur "Sign In" ou "Create Account".
3. Pour la connexion email/password : il saisit son email et son mot de passe, puis soumet le formulaire.
4. Le système vérifie les identifiants via Firebase Auth (`signInWithEmailAndPassword`).
5. En cas de succès, le frontend récupère le token d'identification Firebase (`getIdToken()`).
6. Le frontend appelle `GET /api/auth/me` avec le token dans l'en-tête Authorization.
7. Le middleware backend vérifie le token via `admin.auth().verifyIdToken()`.
8. Si l'utilisateur n'existe pas en base MongoDB, il est automatiquement créé à partir des données Firebase (UID, email, nom, photo).
9. L'utilisateur est redirigé vers la page de chat.

**Variante Google OAuth :**
1. L'utilisateur clique sur "Google".
2. Une popup Firebase Auth s'ouvre pour sélectionner un compte Google.
3. Le reste du flux est identique (récupération du token, appel API, création MongoDB si nécessaire).

**Scénario d'échec :**
- Email/mot de passe incorrect → message d'erreur "Invalid email or password"
- Trop de tentatives → message "Too many attempts. Please try again later."
- Compte désactivé → message "This account has been disabled."

### Cas d'Utilisation 2 : Envoyer un message en temps réel

**Acteur :** Utilisateur authentifié

**Précondition :** L'utilisateur est connecté et une conversation est sélectionnée.

**Scénario principal :**
1. L'utilisateur saisit un message dans le champ de texte en bas de la fenêtre de chat.
2. Il appuie sur Entrée ou clique sur le bouton d'envoi.
3. Le frontend envoie une requête `POST /api/chat/send` avec `{ receiverId, content }`.
4. Le backend vérifie que le destinataire existe (recherche par ID MongoDB).
5. Le backend recherche une conversation existante entre les deux utilisateurs.
6. Si aucune conversation n'existe, elle est créée avec les deux IDs triés pour garantir l'unicité (`userOneId`, `userTwoId`).
7. Le message est créé en base de données avec `chatId`, `senderId`, `content`, `type: 'text'`.
8. Le backend émet un événement Socket.IO `receive_message` vers la room du destinataire (`user_<receiverId>`).
9. Le destinataire reçoit l'événement et met à jour son interface en temps réel.
10. L'expéditeur reçoit la réponse HTTP avec le message créé.

**Variante message vocal :**
1. L'utilisateur maintient le bouton microphone enfoncé.
2. Le navigateur enregistre l'audio via l'API MediaRecorder.
3. Au relâchement, l'audio (blob/base64) est envoyé à Cloudinary via `cloudinary.uploader.upload()` (ressource type "video" pour l'audio).
4. L'URL de l'audio est stockée dans le message avec `type: 'audio'`.
5. Le destinataire reçoit un lecteur audio dans sa bulle de message.

**Scénario d'échec :**
- Message vide → erreur 400 "Content or audio required"
- Message trop long (> 5000 caractères) → erreur 400 "Message too long"
- Destinataire inexistant → erreur 404 "Receiver not found"
- Token invalide/expiré → erreur 401 → le frontend tente un rafraîchissement de token (`getIdToken(true)`) puis réessaie

### Cas d'Utilisation 3 : Modifier un message

**Acteur :** Utilisateur authentifié (expéditeur du message)

**Précondition :** L'utilisateur a envoyé un message qu'il souhaite modifier.

**Scénario principal :**
1. L'utilisateur clique sur l'icône "Plus" de son message, puis sélectionne "Edit".
2. Une barre d'édition apparaît en haut du champ de saisie avec le contenu actuel.
3. L'utilisateur modifie le texte et valide.
4. Le frontend envoie `PUT /api/chat/message/:messageId` avec le nouveau contenu.
5. Le backend vérifie que le message appartient bien à l'utilisateur (`senderId === userId`).
6. Le message est mis à jour en base de données.
7. Un événement Socket.IO `message_updated` est émis vers le destinataire.
8. Les deux participants voient le contenu modifié en temps réel.

### Cas d'Utilisation 4 : Supprimer un message

**Acteur :** Utilisateur authentifié (expéditeur du message)

**Précondition :** L'utilisateur souhaite supprimer un de ses messages.

**Scénario principal :**
1. L'utilisateur clique sur "Plus" puis "Delete" sur son message.
2. Une modale de confirmation apparaît.
3. L'utilisateur confirme la suppression.
4. Le frontend envoie `DELETE /api/chat/message/:messageId`.
5. Le backend vérifie la propriété du message et le supprime.
6. Un événement Socket.IO `message_deleted` est émis vers le destinataire.
7. Le message disparaît des deux interfaces.

### Cas d'Utilisation 5 : Passer un appel audio/vidéo

**Acteur :** Utilisateur authentifié

**Précondition :** Une conversation est active.

**Scénario principal :**
1. L'utilisateur clique sur l'icône téléphone (audio) ou caméra (vidéo) dans l'en-tête du chat.
2. Le navigateur demande l'accès au microphone/caméra via `getUserMedia`.
3. Une connexion WebRTC (`RTCPeerConnection`) est initialisée avec un serveur STUN (`stun.l.google.com:19302`).
4. Le flux local est ajouté à la connexion.
5. Une offre SDP est créée et envoyée via Socket.IO (`call-user`).
6. Le destinataire reçoit l'événement `incoming-call`, voit une modale d'appel entrant et entend une sonnerie.
7. Si le destinataire accepte, son flux média est ajouté à une nouvelle `RTCPeerConnection`, une réponse SDP est créée et renvoyée (`answer-call`).
8. Les candidats ICE sont échangés en temps réel via Socket.IO (`ice-candidate`).
9. La connexion peer-to-peer est établie, les flux audio/vidéo sont affichés dans `CallModal`.
10. L'un des participants raccroche → événement `end-call` → la connexion WebRTC est fermée.

### Cas d'Utilisation 6 : Mettre à jour son profil

**Acteur :** Utilisateur authentifié

**Précondition :** L'utilisateur est sur la page des paramètres.

**Scénario principal (nom) :**
1. L'utilisateur modifie son nom d'affichage dans le champ "Display Name".
2. Il clique sur "Save Settings".
3. Le frontend appelle `updateProfile(firebaseUser, { displayName })` — mise à jour directe dans Firebase Auth.
4. Le callback `onUpdateUser` met à jour le localStorage avec les nouvelles données.
5. Un message de succès s'affiche.

**Scénario principal (email) :**
1. L'utilisateur saisit un nouvel email dans le champ "New Email Address".
2. Il clique sur "Update Email".
3. Le frontend appelle `updateEmail(firebaseUser, newEmail)`.
4. Si la session est récente, l'email est mis à jour directement.
5. Si Firebase retourne `auth/requires-recent-login`, une modale de ré-authentification s'ouvre.
6. L'utilisateur saisit son mot de passe (ou se reconnecte via Google popup).
7. Après ré-authentification réussie (`reauthenticateWithCredential`), l'opération est retentée.
8. Un message de succès s'affiche.

**Scénario principal (mot de passe) :**
1. L'utilisateur saisit son mot de passe actuel, son nouveau mot de passe et la confirmation.
2. Il clique sur "Update Password".
3. Le frontend ré-authentifie d'abord avec `EmailAuthProvider.credential(currentPassword)`.
4. Si la ré-authentification réussit, `updatePassword()` est appelée.
5. Si Firebase retourne `auth/requires-recent-login`, la même modale de ré-authentification que pour l'email s'ouvre.
6. Les champs sont vidés après succès.

## 3.2 Conception de la Base de Données

### Modèle Entité-Relation

Le système repose sur trois entités principales : **User**, **Chat** et **Message**.

### Schéma User

```javascript
{
  firebaseUid: String,       // Identifiant unique Firebase (UID)
  name: String,              // Nom d'affichage
  email: String,             // Adresse email (unique)
  image: String,             // URL de l'avatar (Cloudinary ou null)
  status: String,            // 'online' ou 'offline'
  lastSeen: Date,            // Dernière connexion
  timestamps: true           // createdAt, updatedAt (automatiques)
}
```

**Contraintes :**
- `firebaseUid` est unique et obligatoire — c'est le lien avec Firebase Auth.
- `email` est unique et obligatoire.
- `status` par défaut à `'offline'`.

### Schéma Chat

```javascript
{
  userOneId: ObjectId (ref: User),   // Premier participant
  userTwoId: ObjectId (ref: User),   // Second participant
  timestamps: true                   // createdAt, updatedAt
}
```

**Contraintes :**
- Index unique composite sur `(userOneId, userTwoId)` — garantit une seule conversation par paire d'utilisateurs.
- Les IDs sont triés lors de la création pour assurer la cohérence (le plus petit ID est toujours `userOneId`).

### Schéma Message

```javascript
{
  chatId: ObjectId (ref: Chat),    // Conversation parente
  senderId: ObjectId (ref: User),  // Expéditeur
  content: String,                 // Contenu textuel (par défaut '')
  type: String,                    // enum: 'text', 'audio', 'image'
  audioUrl: String,                // URL Cloudinary pour les messages audio
  isSeen: Boolean,                 // Accusé de réception
  seenAt: Date,                    // Date de lecture
  timestamps: true                 // createdAt, updatedAt
}
```

**Contraintes :**
- `content` peut être vide (cas des messages purement audio).
- `type` est limité à `'text'`, `'audio'` ou `'image'` (par défaut `'text'`).

### Relations

```
User (1) ────< Chat (n) >──── (1) User
    │                              │
    │                              │
    └──────────< Message >─────────┘
        (senderId)            (chatId)
```

- Un **User** peut participer à plusieurs **Chats** (relation many-to-many via les deux champs `userOneId`/`userTwoId`).
- Un **Chat** contient plusieurs **Messages** (relation one-to-many via `chatId`).
- Un **User** peut envoyer plusieurs **Messages** (relation one-to-many via `senderId`).
- Les messages sont automatiquement créés et mis à jour avec les timestamps Mongoose.

[CADRE VISUEL : Insérer ici le schéma de la base de données (modèle conceptuel ou physique de données) - Centré avec légende : Figure 3.2 : Modèle physique de données de la base de données NoSQL (MongoDB)]

---

# Chapitre 4 : Réalisation et Architecture Technique

## 4.1 Environnement de Développement

Le projet a été développé avec les outils et environnements suivants :

| Outil | Version | Utilisation |
|-------|---------|-------------|
| **VS Code** | Dernière stable | Éditeur de code principal |
| **Git** | Dernière stable | Contrôle de version |
| **GitHub** | — | Hébergement du code source |
| **Node.js** | 18+ / 20+ | Runtime JavaScript |
| **npm** | 9+ | Gestionnaire de paquets |
| **MongoDB** | 7.x (local) | Base de données NoSQL |
| **MongoDB Atlas** | — | Option de base de données cloud |
| **Postman** | — | Tests d'API REST |
| **Firebase Console** | — | Configuration du projet Firebase Auth |
| **Cloudinary Dashboard** | — | Gestion des uploads média |
| **Vercel** | — | Déploiement frontend |
| **Windows PowerShell** | 5.1 | Terminal de développement |

## 4.2 Technologies Utilisées

### Stack Frontend

#### Next.js 16 (App Router)
Next.js est un framework React qui offre le rendu côté serveur (SSR) et la génération de sites statiques. La version 16 avec le App Router permet une organisation modulaire des pages, un chargement optimisé et un routage basé sur le système de fichiers. Le choix de Next.js permet une excellente expérience développeur grâce au Hot Module Replacement (HMR) avec Turbopack.

**Justification :** Next.js est le framework React le plus mature pour le développement d'applications web modernes. Il offre des performances optimisées, un SEO amélioré (même si notre application nécessite une authentification) et une grande communauté.

#### React 19
React est la bibliothèque UI la plus utilisée pour construire des interfaces interactives. La version 19 apporte des améliorations de performance et de nouvelles fonctionnalités comme les Server Components. Les hooks React (`useState`, `useEffect`, `useRef`) sont utilisés intensivement pour la gestion d'état et les effets de bord.

#### Tailwind CSS v4
Tailwind CSS est un framework CSS utilitaire qui permet de construire des interfaces rapidement sans écrire de CSS personnalisé. La version 4 utilise les nouvelles fonctionnalités de CSS comme `@layer` et les `@theme` directives pour une personnalisation avancée. Les classes utilitaires sont utilisées directement dans le JSX pour la mise en page, les couleurs, les espacements et les animations.

**Justification :** Tailwind CSS accélère considérablement le développement frontend grâce à ses classes utilitaires prévisibles. La cohérence visuelle est garantie par le système de design tokens.

#### Framer Motion 12
Bibliothèque d'animations pour React, utilisée pour les transitions de pages (fade + slide), les modales (scale), les messages d'erreur/succès (fade-in), et les barres d'édition (AnimatePresence). Framer Motion utilise le Physical Model pour des animations naturelles.

#### Lucide React
Bibliothèque d'icônes open source avec plus de 1000 icônes. Utilisée pour tous les éléments iconographiques de l'interface (messages, paramètres, appels, navigation).

#### emoji-picker-react
Composant de sélecteur d'émojis intégré dans la zone de saisie des messages. Supporte le thème sombre pour cohérence avec le design de l'application.

#### Firebase Client SDK (@firebase/auth)
SDK Firebase côté client utilisé pour l'authentification : `signInWithEmailAndPassword`, `signInWithPopup` (Google), `createUserWithEmailAndPassword`, `sendEmailVerification`, `sendPasswordResetEmail`, `updateProfile`, `updateEmail`, `updatePassword`, `reauthenticateWithCredential`, `reauthenticateWithPopup`.

### Stack Backend

#### Node.js
Runtime JavaScript événementiel, non-bloquant, idéal pour les applications temps réel. Permet de partager le langage JavaScript entre le frontend et le backend.

#### Express 5
Framework web minimaliste et flexible pour Node.js. La version 5 apporte le support natif des promesses et des async/await. Express est utilisé pour :
- Définir les routes API RESTful
- Gérer les middlewares (CORS, JSON parsing, authentification)
- Exposer l'instance Socket.IO via `req.io`

#### Socket.IO 4
Bibliothèque de communication bidirectionnelle en temps réel basée sur WebSockets. Socket.IO offre des fonctionnalités critiques pour notre application :
- **Auto-reconnexion** : Gestion des déconnexions réseau
- **Rooms** : Isolation des événements par utilisateur (`user_<userId>`)
- **Fallback** : Long polling en cas d'indisponibilité WebSocket
- **Handshake middleware** : Authentification des connexions Socket

#### MongoDB + Mongoose 9
MongoDB est une base de données NoSQL orientée documents, idéale pour les applications modernes qui évoluent rapidement. Mongoose est l'ODM (Object Document Mapper) qui fournit :
- Une modélisation structurée des données via des schémas
- La validation des données
- Les relations (références et population)
- Les index optimisés

#### Firebase Admin SDK
SDK Firebase côté serveur pour la vérification des tokens d'identification. Initialisé avec uniquement le `projectId` — la méthode `verifyIdToken()` fonctionne sans fichier de clé de service car elle utilise les clés publiques Google.

#### Cloudinary v2
Service de gestion d'images et de vidéos dans le cloud. Utilisé pour :
- Le stockage des avatars utilisateur (transformation 400x400, crop fill)
- Le stockage des messages audio (ressource type "video" car Cloudinary traite l'audio comme une vidéo sans piste visuelle)

### Dépendances Techniques Complémentaires

| Package | Rôle Technique |
|---------|----------------|
| `axios` | Client HTTP avec intercepteurs pour l'injection automatique du token Firebase |
| `cors` | Middleware Express pour restreindre les origines |
| `dotenv` | Chargement des variables d'environnement |
| `date-fns` | Formatage des dates et heures relatives |
| `socket.io-client` | Client Socket.IO pour le navigateur |
| `@tailwindcss/postcss` | Plugin PostCSS pour Tailwind v4 |
| `nodemon` | Redémarrage automatique du serveur en développement |

## 4.3 Architecture et Structure du Projet

### Arborescence Complète

```
Chatihna/
│
├── chati-hna-frontend/                 # Application Next.js
│   ├── .env.local                      # Variables d'environnement (Firebase, API)
│   ├── next.config.mjs                 # Configuration Next.js (Turbopack)
│   ├── postcss.config.mjs              # Configuration PostCSS
│   ├── package.json                    # Dépendances frontend
│   ├── vercel.json                     # Configuration de déploiement Vercel
│   │
│   ├── public/                         # Ressources statiques
│   │   ├── favicon.ico
│   │   └── file.svg
│   │
│   └── src/
│       ├── app/                        # Pages (App Router)
│       │   ├── layout.js               # Layout racine (fonts, CSS global)
│       │   ├── globals.css             # Styles globaux, variables CSS, classe .glass
│       │   ├── page.js                 # Page d'accueil (landing hero)
│       │   ├── manifest.js             # Manifest PWA
│       │   │
│       │   ├── login/
│       │   │   └── page.js             # Page de connexion
│       │   │
│       │   ├── register/
│       │   │   └── page.js             # Page d'inscription
│       │   │
│       │   ├── chat/
│       │   │   └── page.js             # Page principale de chat (468 lignes)
│       │   │
│       │   └── settings/
│       │       └── page.js             # Page des paramètres (wrapper)
│       │
│       ├── components/                 # Composants React réutilisables
│       │   ├── Sidebar.js              # Barre latérale de navigation
│       │   ├── ChatList.js             # Liste des conversations
│       │   ├── ChatWindow.js           # Fenêtre de chat (messages, envoi, audio)
│       │   ├── ContactsList.js         # Liste des contacts
│       │   ├── AlertsList.js           # Liste des alertes non lues
│       │   ├── SettingsView.js         # Paramètres avec backend API
│       │   ├── SettingsFirebase.js     # Paramètres Firebase-only (535 lignes)
│       │   └── CallModal.js            # Modale d'appel audio/vidéo
│       │
│       └── lib/                        # Bibliothèques et utilitaires
│           ├── firebase.js             # Initialisation Firebase (config)
│           ├── api.js                  # Instance Axios avec intercepteur JWT
│           └── socket.js               # Client Socket.IO (connect/disconnect)
│
└── chati-hna-backand/                  # Serveur Express
    ├── .env                            # Variables d'environnement (PORT, MongoDB, Firebase)
    ├── package.json                    # Dépendances backend
    ├── vercel.json                     # Configuration de déploiement Vercel
    │
    └── src/
        ├── index.js                    # Point d'entrée (serveur, Socket.IO, MongoDB)
        │
        ├── config/
        │   └── cloudinary.js           # Configuration Cloudinary
        │
        ├── models/
        │   ├── User.js                 # Modèle utilisateur
        │   ├── Chat.js                 # Modèle conversation
        │   └── Message.js              # Modèle message
        │
        ├── controllers/
        │   ├── authController.js       # Contrôleur d'authentification (getMe, updateProfile)
        │   └── chatController.js       # Contrôleur de chat (messages, contacts, recherche)
        │
        ├── middlewares/
        │   └── authMiddleware.js       # Middleware de vérification Firebase token
        │
        └── routes/
            ├── authRoutes.js           # Routes /api/auth
            └── chatRoutes.js           # Routes /api/chat
```

### Rôle des Dossiers Principaux

**`src/app/`** (Frontend) : Pages de l'application Next.js utilisant le App Router. Chaque sous-dossier correspond à une route : `/login`, `/register`, `/chat`, `/settings`. La page d'accueil est le fichier `page.js` à la racine.

**`src/components/`** (Frontend) : Composants React réutilisables organisés par fonctionnalité. `Sidebar.js` gère la navigation, `ChatWindow.js` gère l'affichage et l'envoi des messages, `CallModal.js` gère les appels WebRTC.

**`src/lib/`** (Frontend) : Modules de configuration et d'initialisation. `firebase.js` initialise le SDK Firebase, `api.js` configure Axios avec l'intercepteur d'authentification, `socket.js` gère la connexion Socket.IO.

**`src/controllers/`** (Backend) : Logique métier des routes. `authController.js` gère la récupération et la mise à jour du profil. `chatController.js` gère toutes les opérations liées aux messages et aux conversations.

**`src/models/`** (Backend) : Définition des schémas Mongoose pour MongoDB. Chaque modèle correspond à une collection : `User`, `Chat`, `Message`.

**`src/middlewares/`** (Backend) : Middleware Express pour l'authentification Firebase. Vérifie le token JWT et attache l'utilisateur MongoDB à `req.user`.

**`src/routes/`** (Backend) : Définition des routes Express. `authRoutes.js` expose `GET /api/auth/me` et `PUT /api/auth/me`. `chatRoutes.js` expose les endpoints de messagerie.

## 4.4 Focus Code : Analyse des Modules Majeurs

Cette section propose une immersion technique dans le code source de Chatihna, détaillant les mécanismes de sécurité, de transport en temps réel et de gestion des flux médias.

### 4.4.1 Logique d'Authentification et Session (Firebase + Express Middleware)

Pour sécuriser l'API REST, un middleware Express intercepte chaque requête, extrait le token Bearer JWT généré par Firebase Auth sur le client, et le valide côté serveur à l'aide de `firebase-admin`.

**Middleware de validation (`authMiddleware.js`) :**
```javascript
const admin = require('firebase-admin');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Validation du token JWT Firebase
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name: firebaseName, picture } = decoded;

    // Récupération ou synchronisation avec le profil MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: firebaseName || email.split('@')[0],
        email,
        image: picture || null,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Firebase auth error:', error.code || error.message);
    res.status(401).json({ message: "Token is not valid", error: error.code || error.message });
  }
};

module.exports = authMiddleware;
```

**Client HTTP Axios et renouvellement automatique (`api.js`) :**
Côté client, un intercepteur Axios injecte dynamiquement le token. Si l'API renvoie un statut `401 Unauthorized` (token expiré), le client tente une réobtention silencieuse du token Firebase avant de relancer automatiquement la requête initiale.

```javascript
import axios from 'axios';
import { auth } from '@/lib/firebase';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// Intercepteur de requêtes pour l'injection du JWT
api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponses pour la gestion silencieuse des expirations
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (auth.currentUser) {
          // Force la réobtention d'un nouveau token JWT
          await auth.currentUser.getIdToken(true);
          const newToken = await auth.currentUser.getIdToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        await auth.signOut();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### 4.4.2 Gestion des WebSockets (Socket.IO)

La communication bidirectionnelle en temps réel repose sur Socket.IO. Le serveur valide la session dès la phase de handshake WebSockets en utilisant également l'ID token Firebase.

**Validation du Handshake et gestion des événements (`index.js`) :**
```javascript
// Middleware d'authentification WebSocket
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name: firebaseName, picture } = decoded;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: firebaseName || email.split('@')[0],
        email,
        image: picture || null,
      });
    }

    socket.data.user = user;
    next();
  } catch (err) {
    console.error('❌ Socket auth error:', err.code || err.message);
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  const user = socket.data.user;

  // Rejoindre une room propre à l'utilisateur
  socket.join(`user_${user._id}`);
  User.findByIdAndUpdate(user._id, { status: 'online' }).catch(err =>
    console.error('Socket online update error:', err)
  );
  io.emit('user_status', { userId: user._id, status: 'online' });

  // Événement de déconnexion
  socket.on('disconnect', async () => {
    const lastSeen = new Date();
    try {
      await User.findByIdAndUpdate(user._id, { status: 'offline', lastSeen });
      io.emit('user_status', { userId: user._id, status: 'offline', lastSeen });
    } catch (err) {
      console.error('Socket disconnect error:', err);
    }
  });
});
```

---

### 4.4.3 Persistance et Enregistrement Média

Lorsqu'un utilisateur transmet un message, la base MongoDB l'enregistre et le serveur Socket.IO le distribue immédiatement dans la room du destinataire. Pour les messages vocaux, le client enregistre l'audio sous forme de Blob, le convertit en Base64, puis le serveur l'héberge sur Cloudinary.

**Logique d'enregistrement et routage (`chatController.js`) :**
```javascript
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, audio } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver required" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    
    if (!content && !audio) {
      return res.status(400).json({ message: "Content or audio required" });
    }

    // Recherche de conversation existante ou création
    let chat = await Chat.findOne({
      $or: [
        { userOneId: senderId, userTwoId: receiverId },
        { userOneId: receiverId, userTwoId: senderId }
      ]
    });

    if (!chat) {
      const ids = [senderId, receiverId].sort();
      chat = await Chat.create({
        userOneId: ids[0],
        userTwoId: ids[1]
      });
    }

    let audioUrl = null;
    let type = 'text';

    // Traitement de l'upload audio vers Cloudinary
    if (audio) {
      const uploadResponse = await cloudinary.uploader.upload(audio, {
        resource_type: "video", // Type vidéo requis pour les formats WebM/Audio
        folder: "chat_audio",
      });
      audioUrl = uploadResponse.secure_url;
      type = 'audio';
    }

    const message = await Message.create({
      chatId: chat._id,
      senderId,
      content,
      type,
      audioUrl
    });

    const populatedMessage = await Message.findById(message._id).populate('senderId', 'name');

    const result = {
      id: populatedMessage._id,
      chatId: populatedMessage.chatId,
      senderId: populatedMessage.senderId._id,
      sender: populatedMessage.senderId,
      content: populatedMessage.content,
      type: populatedMessage.type || 'text',
      audioUrl: populatedMessage.audioUrl,
      isSeen: populatedMessage.isSeen,
      createdAt: populatedMessage.createdAt
    };

    // Acheminement instantané via Socket.IO
    req.io.to(`user_${receiverId}`).emit('receive_message', result);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Enregistrement Audio Client (`ChatWindow.js`) :**
Le client capture le microphone via l'API `MediaRecorder` et transmet le flux audio brut encodé en Base64 :
```javascript
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorderRef.current = new MediaRecorder(stream);
  audioChunksRef.current = [];

  mediaRecorderRef.current.ondataavailable = (e) => {
    audioChunksRef.current.push(e.data);
  };

  mediaRecorderRef.current.onstop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      onSendMessage('', reader.result); // Transmission vers l'API
    };
  };

  mediaRecorderRef.current.start();
};
```

---

### 4.4.4 Module d'Appels et Négociation WebRTC (Signaling)

Les appels vidéo et audio s'effectuent directement en Peer-to-Peer. Le serveur Socket.IO sert uniquement de canal de signalisation (Signaling Channel) pour relayer les métadonnées SDP (Offers/Answers) et les candidats de connectivité ICE.

**Relais de signalisation côté serveur (`index.js`) :**
```javascript
// Événements de signalisation WebRTC relayés
socket.on('call-user', ({ to, offer, fromName, type }) => {
  io.to(`user_${to}`).emit('incoming-call', {
    from: user._id,
    fromName,
    offer,
    type
  });
});

socket.on('answer-call', ({ to, answer }) => {
  io.to(`user_${to}`).emit('call-answered', { answer });
});

socket.on('ice-candidate', ({ to, candidate }) => {
  io.to(`user_${to}`).emit('ice-candidate', { candidate });
});

socket.on('end-call', ({ to }) => {
  io.to(`user_${to}`).emit('call-ended');
});
```

---

## 4.5 Présentation des Interfaces Utilisateur

Pour optimiser l'ergonomie, Chatihna implémente un design résolument moderne intégrant du floutage d'arrière-plan (Glassmorphism), un thème sombre par défaut, et des interactions animées via Framer Motion. L'organisation des différents écrans se présente comme suit :

### 4.5.1 Page d'Authentification (Connexion et Inscription)
L'interface de connexion offre un accès sécurisé par formulaire standard ou via l'API Google Sign-In. Un soin particulier a été apporté à la gestion des erreurs Firebase pour guider l'utilisateur.

[CADRE VISUEL : Insérer ici la capture d'écran de la page de profil ou de connexion (Login) - Centré avec légende : Figure 4.1 : Interface d'authentification utilisateur (Connexion)]

[CADRE VISUEL : Insérer ici la capture d'écran de l'interface d'inscription (Register) - Centré avec légende : Figure 4.2 : Interface de création de compte utilisateur (Inscription)]

### 4.5.2 Tableau de Bord de Discussion (Chat principal)
Cette interface regroupe la liste des conversations triées chronologiquement (`ChatList`) et la fenêtre de messagerie active (`ChatWindow`). Elle gère l'affichage en temps réel du statut d'écriture et de lecture.

[CADRE VISUEL : Insérer ici la capture d'écran de l'interface de discussion en temps réel (Chat Room) - Centré avec légende : Figure 4.3 : Interface principale de discussion en temps réel (Salon de chat)]

### 4.5.3 Gestion des Contacts et Présence en Ligne
Un annuaire affiche l'ensemble des utilisateurs inscrits de l'institution SOLICODE, indiquant leur disponibilité en direct avec des badges colorés (Vert : en ligne, Gris : hors ligne avec horodatage).

[CADRE VISUEL : Insérer ici la capture d'écran de la liste des contacts (ContactsList) - Centré avec légende : Figure 4.4 : Interface de gestion et d'affichage de l'annuaire des contacts]

### 4.5.4 Notifications et Système d'Alertes
Un onglet d'alertes liste toutes les conversations comportant des messages en attente de lecture, permettant de naviguer instantanément vers celles-ci.

[CADRE VISUEL : Insérer ici la capture d'écran des alertes (AlertsList) - Centré avec légende : Figure 4.5 : Interface du centre de notifications et d'alertes de messages non lus]

### 4.5.5 Fenêtre d'Appels Audio et Vidéo
Lorsque la liaison WebRTC s'établit, une interface plein écran s'ouvre, superposant la vidéo distante et locale avec des commandes intuitives pour couper le flux de capture média ou raccrocher.

[CADRE VISUEL : Insérer ici la capture d'écran de la modale d'appel audio/vidéo (CallModal) - Centré avec légende : Figure 4.6 : Interface de communication vidéo interactive via WebRTC]

### 4.5.6 Paramètres de Profil et Sécurité
Cet écran modulaire permet aux utilisateurs de mettre à jour leur profil (avatar hébergé sur Cloudinary) et de procéder aux ré-authentifications indispensables pour les modifications d'email ou de mot de passe.

[CADRE VISUEL : Insérer ici la capture d'écran de la fenêtre de paramètres ou de profil (SettingsView / SettingsFirebase) - Centré avec légende : Figure 4.7 : Interface de configuration du profil utilisateur et des paramètres de sécurité]

---

# Chapitre 5 : Tests, Déploiement et Conclusion

## 5.1 Tests Réalisés

### Tests de Validation des Formulaires

**Côté Frontend :**
- Validation des champs requis (nom, email, mot de passe) avec messages d'erreur
- Validation de la longueur minimale du mot de passe (6 caractères)
- Vérification de la correspondance des mots de passe (nouveau mot de passe + confirmation)
- Validation de l'email : format valide et email différent de l'actuel
- Validation de la taille des fichiers image (max 5MB)
- Validation de la longueur du nom d'affichage

**Côté Backend :**
- Validation de la longueur du nom (1-50 caractères)
- Validation de la longueur du contenu des messages (max 5000 caractères)
- Vérification de l'existence du destinataire avant envoi
- Validation de la présence du contenu ou de l'audio
- Limitation de la requête de recherche (max 200 caractères)
- Vérification d'autorisation : l'utilisateur doit être participant de la conversation pour voir les messages

### Tests de Sécurité des Routes

- **Authentification obligatoire** : Toutes les routes API (sauf la racine) sont protégées par le middleware `authMiddleware`. Toute requête sans token ou avec token invalide reçoit une réponse 401.
- **Vérification de propriété** : Les opérations de modification et suppression de messages vérifient que `senderId === userId`.
- **Restriction CORS** : Le backend n'accepte que les requêtes provenant de l'origine définie dans `CLIENT_URL`.
- **Protection Socket.IO** : La connexion Socket.IO est authentifiée dès le handshake — aucune communication n'est possible sans token valide.
- **Ré-authentification Firebase** : Les opérations sensibles (changement d'email, mot de passe) nécessitent une session récente sous peine de déclencher une modale de ré-authentification.

### Tests de Réactivité et d'Interface

- **Design responsive** : L'interface s'adapte aux écrans mobiles, tablettes et desktop grâce à Tailwind CSS (classes `sm:`, `md:`, `lg:`).
- **Animations** : Les transitions de pages, modales et messages d'état sont fluides grâce à Framer Motion.
- **Notifications** : Les notifications navigateur (API Notification) sont demandées à la connexion et fonctionnent même lorsque l'onglet n'est pas actif.
- **Sons** : Les sons de notification et de sonnerie d'appel sont joués via l'API Audio.

### Tests de Charge pour le Temps Réel

- **Connexions simultanées** : Socket.IO gère efficacement plusieurs connexions simultanées avec isolation par rooms.
- **Reconnexion** : En cas de perte de connexion réseau, Socket.IO tente automatiquement de se reconnecter.
- **Rafraîchissement de token** : Si le token Firebase expire, l'intercepteur Axios le rafraîchit automatiquement et réessaie la requête.

## 5.2 Déploiement

### Configuration du Déploiement

Le projet est configuré pour être déployé sur **Vercel**, une plateforme de déploiement optimisée pour les applications Next.js.

**Frontend (Vercel) :**
Le fichier `vercel.json` à la racine du frontend configure le déploiement :
```json
{
  "version": 2,
  "framework": "nextjs",
  "regions": ["sfo1"],
  "cleanUrls": true
}
```

**Backend (Vercel) :**
Le backend Express est déployé via Vercel avec l'adaptateur `@vercel/node` :
```json
{
  "version": 2,
  "builds": [{ "src": "src/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.js" }]
}
```

### Étapes de Déploiement

1. **Configuration Firebase** : Créer un projet Firebase, activer l'authentification par email/mot de passe et Google OAuth.
2. **Configuration MongoDB Atlas** : Créer un cluster MongoDB Atlas, obtenir l'URI de connexion.
3. **Configuration Cloudinary** : Créer un compte Cloudinary, récupérer les clés API.
4. **Variables d'environnement** : Définir les variables sur Vercel pour le frontend (`NEXT_PUBLIC_*`) et le backend.
5. **Déploiement** : Connecter les dépôts GitHub à Vercel, déployer automatiquement à chaque push.

### Prérequis pour la Production

- Les variables d'environnement Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) doivent être définies sur le backend pour le bon fonctionnement des uploads d'images et de messages audio.
- Le `FIREBASE_PROJECT_ID` doit être défini pour l'initialisation du Firebase Admin SDK.
- La `MONGO_URI` doit pointer vers MongoDB Atlas (ou une instance MongoDB distante).
- Le `CLIENT_URL` doit être mis à jour avec l'URL de production du frontend pour les CORS.

## 5.3 Conclusion Générale et Perspectives

### Bilan du Projet

Le projet Chatihna a permis de concevoir et développer une application de messagerie instantanée complète, répondant aux objectifs fixés :

- **Communication en temps réel** : Les messages sont livrés instantanément grâce à Socket.IO, avec un système de présence en ligne/hors ligne.
- **Expérience utilisateur premium** : L'interface minimaliste au thème sombre, les animations fluides et la navigation intuitive offrent une expérience moderne et agréable.
- **Sécurité renforcée** : L'authentification Firebase à deux facteurs (email/password + Google), la vérification systématique des tokens et la validation côté serveur garantissent un niveau de sécurité élevé.
- **Fonctionnalités avancées** : Messages vocaux, appels audio/vidéo WebRTC, modification/suppression de messages, émojis, notifications.

### Compétences Acquises

**Compétences Techniques :**
- Maîtrise de Next.js 16 avec le App Router pour le développement d'applications React modernes
- Conception d'API RESTful avec Express 5 et architecture MVC
- Intégration de Firebase Auth (client + admin SDK) pour une authentification sécurisée
- Développement temps réel avec Socket.IO (rooms, événements, middleware)
- Implémentation de WebRTC pour les appels audio/vidéo peer-to-peer
- Modélisation de données avec MongoDB et Mongoose
- Utilisation de Tailwind CSS v4 pour un design responsive et cohérent
- Animations d'interface avec Framer Motion
- Gestion de projets avec Git et GitHub

**Compétences Humaines :**
- Organisation et planification du travail en phases itératives
- Résolution de problèmes complexes (synchronisation temps réel, gestion d'état)
- Documentation technique et rédaction de rapports
- Autonomie dans la recherche de solutions et l'apprentissage de nouvelles technologies

### Perspectives d'Évolution

Chatihna dispose d'un potentiel d'évolution important. Les fonctionnalités suivantes pourraient être implémentées :

1. **Appels audio/vidéo de groupe** : Extension de WebRTC pour supporter les conférences multipartites (via SFU comme LiveKit ou Jitsi).

2. **Salons de discussion de groupe** : Création de conversations avec plus de deux participants, avec gestion des rôles (admin, membre).

3. **Partage de fichiers volumineux** : Upload et partage de documents (PDF, images haute résolution, vidéos) avec prévisualisation intégrée.

4. **Chiffrement de bout en bout** : Implémentation du chiffrement des messages côté client avant envoi pour une confidentialité maximale.

5. **Mode hors ligne** : Mise en cache des messages avec Service Workers pour une consultation hors ligne et une synchronisation automatique à la reconnexion.

6. **Version mobile native** : Développement d'applications iOS et Android avec React Native ou Flutter en réutilisant l'API existante.

7. **Thème clair/sombre personnalisable** : Ajout d'un sélecteur de thème avec mémorisation des préférences utilisateur.

8. **Internationalisation** : Support multilingue (français, anglais, arabe) avec Next.js Internationalization.

9. **Modération et signalement** : Système de signalement de messages abusifs et outils de modération pour les administrateurs.

10. **Intelligence Artificielle** : Intégration d'un assistant de suggestions de réponses, traduction automatique des messages, et modération automatisée des contenus.

En conclusion, Chatihna représente une base solide et évolutive pour une application de messagerie instantanée moderne. L'architecture technique choisie permet une évolution progressive et l'ajout de nouvelles fonctionnalités sans révision majeure des fondations établies.

---

# Webographie & Bibliographie

## Performance et Optimisation

### Optimisation du rendu React

- **Mise en œuvre du principe de mémorisation** (`React.memo`) pour les composants fonctionnels présentant des propriétés immuables, réduisant les re‑renders inutiles.
- **Hook `useCallback` et `useMemo`** : encapsuler les callbacks et les valeurs dérivées afin d’éviter la recreation d’objets à chaque rendu.
- **Virtualisation des listes** (`react‑virtualized` / `react‑window`) pour les longues listes de messages, limitant le nombre d’éléments DOM et améliorant le FPS.
- **Splitting du code** avec `next/dynamic` : chargement différé des composants lourds (ex. `ChatWindow`, `CallModal`) afin de réduire le temps de première peinture (TTI).

### Gestion des re‑renders

- Analyse des dépendances du tableau de dépendance des hooks `useEffect` pour éviter les boucles infinies.
- Utilisation de l’approche **selector‑based** avec Zustand ou Redux Toolkit `createSelector` afin de ne souscrire qu’aux fragments d’état réellement nécessaires.
- **Batching des mises à jour d’état** grâce à la fonction de mise à jour fonctionnelle (`setState(prev => …)`) et à la configuration de React 18 (`automatic batching`).

### Optimisation Socket.IO

- **Compression des paquets** (`perMessageDeflate`) activée côté serveur et client pour diminuer la charge réseau.
- **Émission d’événements agrégés** : regrouper les notifications « typing » dans un intervalle de 300 ms au lieu d’un message par frappe.
- **Gestion des rooms** : utilisation d’identifiants de salle (`user_{id}`) pour limiter la diffusion aux destinataires concernés.
- **Reconnect automatique** avec back‑off exponentiel afin de préserver la bande passante lors de pertes de connexion.

### Lazy loading

- **Chargement différé des modules** (`next/dynamic`, `React.lazy`) pour les pages non critiques (profil utilisateur, paramètres, galerie médias).
- **Pré‑chargement conditionnel** des dépendances de WebRTC uniquement lors de l’initiation d’un appel.

### Optimisation des requêtes MongoDB

- **Indexation ciblée** sur les champs `chatId`, `receiverId`, `createdAt` afin d’accélérer les recherches de conversations et les tris chronologiques.
- **Projection des champs** (`select`) pour ne renvoyer que les colonnes nécessaires (ex. `sender`, `content`, `createdAt`) et réduire la taille de la réponse.
- **Aggregation pipeline** pour le comptage des messages non lus, évitant les multiples aller‑retour client‑serveur.

### Caching potentiel

- **Cache en mémoire** (`node-cache`) pour les métadonnées de l’utilisateur (profil, liste de contacts) avec TTL de quelques minutes.
- **Cache côté client** via le `React Query`/`SWR` pour les requêtes d’historique de conversation, invalidé à chaque réception de nouveau message via Socket.IO.
- **Utilisation de CDN** (Cloudinary) pour les médias afin de profiter du edge‑caching et réduire la latence de téléchargement.

### Optimisation des flux WebRTC

- **Adaptation du bitrate** (`RTCRtpSender.setParameters`) en fonction de la bande passante détectée.
- **Priorisation du codec** : sélection de VP9/AV1 lorsqu’ils sont supportés pour une meilleure compression.
- **Gestion dynamique des résolutions** (simulcast) afin de basculer entre 720 p et 480 p selon la qualité réseau.
- **Utilisation de ICE‑reuse** pour conserver les candidates déjà vérifiées entre plusieurs appels.

### Performance responsive

- **Media queries** et `container queries` de Tailwind v4 pour charger les assets adaptés à la résolution d’écran.
- **Image optimisation** via Cloudinary (`auto=format, quality=auto`) et `next/image` pour le lazy loading des avatars.
- **Détection de l’appareil** (`navigator.hardwareConcurrency`) afin de dimensionner le nombre de workers Web Workers pour le chiffrement des messages.

### Optimisation du build Next.js

- **Analyse de bundle** (`next build && next analyze`) pour identifier les dépendances lourdes.
- **Tree‑shaking** et **code splitting** avec `dynamic import`.
- **Compression gzip/brotli** à la livraison sur Vercel.
- **Static Generation (SSG)** pour les pages publiques (landing page, documentation) afin de servir du HTML pré‑rendu.

### Réduction de la latence réseau

- **Utilisation de HTTP/2** (automatique sur Vercel) pour multiplexage des requêtes.
- **Edge Functions** pour les appels d’authentification et de signalisation WebRTC, réduisant le RTT.
- **Géolocalisation du endpoint MongoDB Atlas** proche de Vercel (region `eu-central-1`).

---

## Documentations Officielles

- **Next.js Documentation** : Guide officiel de Next.js (App Router, Rendering, Route Handlers, et optimisations). [https://nextjs.org/docs](https://nextjs.org/docs)
- **React 19 Documentation** : Référence officielle de React 19, hooks d'état (`useState`, `useEffect`, `useRef`) et composants serveurs. [https://react.dev](https://react.dev)
- **Node.js Runtime** : Documentation technique officielle du runtime JavaScript Node.js v18/v20. [https://nodejs.org/api](https://nodejs.org/api)
- **Express.js Framework** : Guide officiel d'Express 5 pour la construction et l'architecture d'API RESTful. [https://expressjs.com](https://expressjs.com)
- **Socket.IO API Reference** : Spécifications techniques de Socket.IO 4 pour les communications temps réel WebSockets et les handshakes. [https://socket.io/docs/v4/](https://socket.io/docs/v4/)
- **Mongoose ODM Documentation** : Modélisation d'objets MongoDB avec schémas typés, validations, indexations et jointures de documents (`populate`). [https://mongoosejs.com/docs/](https://mongoosejs.com/docs/)
- **Firebase Authentication & Admin SDK** : Guides d'intégration de Firebase Auth client et de validation serveur des ID Tokens JWT. [https://firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)
- **WebRTC API MDN** : Spécification de l'API RTCPeerConnection pour l'établissement de flux audio et vidéo peer-to-peer. [https://developer.mozilla.org/fr/docs/Web/API/WebRTC_API](https://developer.mozilla.org/fr/docs/Web/API/WebRTC_API)
- **Tailwind CSS v4** : Guide officiel du framework CSS utilitaire pour le responsive design et la gestion thématique. [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Cloudinary SDK** : Gestion des médias, upload d'images et stockage de fichiers audio convertis en Base64. [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Framer Motion Guide** : Conception d'animations physiques, de layouts dynamiques et de transitions de pages React. [https://www.framer.com/motion/](https://www.framer.com/motion/)

---

*Rapport réalisé dans le cadre du Projet de Fin d'Études — SOLICODE / OFPPT — Année 2025/2026.*
- **Next.js Documentation** : Guide officiel de Next.js (App Router, Rendering, Route Handlers, et optimisations). [https://nextjs.org/docs](https://nextjs.org/docs)
- **React 19 Documentation** : Référence officielle de React 19, hooks d'état (`useState`, `useEffect`, `useRef`) et composants serveurs. [https://react.dev](https://react.dev)
- **Node.js Runtime** : Documentation technique officielle du runtime JavaScript Node.js v18/v20. [https://nodejs.org/api](https://nodejs.org/api)
- **Express.js Framework** : Guide officiel d'Express 5 pour la construction et l'architecture d'API RESTful. [https://expressjs.com](https://expressjs.com)
- **Socket.IO API Reference** : Spécifications techniques de Socket.IO 4 pour les communications temps réel WebSockets et les handshakes. [https://socket.io/docs/v4/](https://socket.io/docs/v4/)
- **Mongoose ODM Documentation** : Modélisation d'objets MongoDB avec schémas typés, validations, indexations et jointures de documents (`populate`). [https://mongoosejs.com/docs/](https://mongoosejs.com/docs/)
- **Firebase Authentication & Admin SDK** : Guides d'intégration de Firebase Auth client et de validation serveur des ID Tokens JWT. [https://firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)
- **WebRTC API MDN** : Spécification de l'API RTCPeerConnection pour l'établissement de flux audio et vidéo peer-to-peer. [https://developer.mozilla.org/fr/docs/Web/API/WebRTC_API](https://developer.mozilla.org/fr/docs/Web/API/WebRTC_API)
- **Tailwind CSS v4** : Guide officiel du framework CSS utilitaire pour le responsive design et la gestion thématique. [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Cloudinary SDK** : Gestion des médias, upload d'images et stockage de fichiers audio convertis en Base64. [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Framer Motion Guide** : Conception d'animations physiques, de layouts dynamiques et de transitions de pages React. [https://www.framer.com/motion/](https://www.framer.com/motion/)

---

*Rapport réalisé dans le cadre du Projet de Fin d'Études — SOLICODE / OFPPT — Année 2025/2026.*