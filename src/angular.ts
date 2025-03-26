import { generateAiFriendlyAngularDocs } from "@features/angular-docs/generateAiFriendlyAngularDocs";
import { HuggingFaceEmbedding } from "@llamaindex/huggingface";
import { findMarkdownFiles } from "@shared/file-utils/findMarkdownFiles";
import { cloneRepository } from "@shared/github/cloneRepository";
import { createCollectionFromMarkdownFiles } from "@shared/llamaindex/createCollectionFromMarkdownFiles";
import { getAngularLatestVersion } from "@shared/utils/get-angular-version";
import { Settings } from "llamaindex";

/**
 * Main entry point for the AI-friendly Angular documentation generation script.
 * Creates documentation and vector embeddings for Angular framework.
 *
 * @remarks
 * This script performs two main operations:
 * 1. Generates AI-friendly documentation from Angular source files
 * 2. Creates vector embeddings and stores them in a Qdrant collection
 *
 * Uses default configuration settings defined in the feature.
 *
 * @returns Promise that resolves when the process completes
 * @throws Error if documentation generation or embedding creation fails
 * @see generateAiFriendlyAngularDocs for the main transformation logic
 * @see createCollectionFromMarkdownFiles for the embedding process
 */
async function main() {
  console.log("Retrieving latest Angular version...");
  /** Angular version to process */
  const version = await getAngularLatestVersion();
  /** Repository directory */
  const repoDir = `./cloned-repos/angular-${version}`;
  /** Source directory containing original Angular documentation */
  const sourceDir = `${repoDir}/adev/src/content`;
  /** Target directory where AI-friendly documentation will be written */
  const targetDir = `./ai-friendly-docs/angular-${version}`;

  console.log("Latest Angular version is:", version, "\n");

  try {
    // Clone the Angular repository with the specified version
    await cloneRepository({
      owner: "angular",
      repo: "angular",
      version: version,
      targetDir: repoDir,
      depth: 1,
    });
    await generateAiFriendlyAngularDocs({
      sourceDir,
      targetDir,
    });
    console.log(
      "AI-friendly Angular documentation generation completed successfully!"
    );

    // Configure embedding model for vector generation
    Settings.embedModel = new HuggingFaceEmbedding({
      modelType: "Xenova/all-MiniLM-L6-v2",
    });

    // Create vector embeddings and store in Qdrant collection
    await createCollectionFromMarkdownFiles(
      `angular-${version}`,
      findMarkdownFiles(`./ai-friendly-docs/angular-${version}/sections`)
    );
    console.log(
      `AI-friendly Angular documentation Qdrant collection (angular-${version}) generation completed successfully!`
    );
    process.exit(0);
  } catch (error) {
    console.error(
      "Error during AI-friendly Angular documentation generation:",
      error
    );
    process.exit(1);
  }
}

// Execute the documentation generation process
// This is the entry point for the script
main();
