{-# LANGUAGE OverloadedStrings #-}

import Control.Monad
import Data.Function
import Data.Maybe
import Data.Monoid
import Hakyll
import qualified Data.Set as S
import Text.Pandoc.Options


pandocMathCompiler :: Compiler (Item String)
pandocMathCompiler =
  let mathExtensions = [Ext_tex_math_dollars, Ext_tex_math_double_backslash,
                        Ext_latex_macros]
      defaultExtensions = writerExtensions defaultHakyllWriterOptions
      newExtensions = foldr S.insert defaultExtensions mathExtensions
      writerOptions = defaultHakyllWriterOptions {
                        writerExtensions = newExtensions,
                        writerHTMLMathMethod = MathJax ""
                      }
  in pandocCompilerWith defaultHakyllReaderOptions writerOptions



rules :: Rules ()
rules = do
  match "images/*" $ do
    route   idRoute
    compile copyFileCompiler

  match "css/*" $ do
    route   idRoute
    compile compressCssCompiler

  match "posts/*" $ do
    route $ setExtension "html"
    compile $ pandocMathCompiler
      >>= loadAndApplyTemplate "templates/post.html"    postCtx
      >>= loadAndApplyTemplate "templates/default.html" postCtx
      >>= relativizeUrls

  create ["archive.html"] $ do
    route idRoute
    compile $ do
      posts <- loadAll "posts/*" >>= recentFirst
      let archiveCtx = mempty
            <> listField "posts" postCtx (return posts)
            <> constField "title" "Archives"
            <> myContext

      makeItem ""
        >>= loadAndApplyTemplate "templates/archive.html" archiveCtx
        >>= loadAndApplyTemplate "templates/default.html" archiveCtx
        >>= relativizeUrls


  match "index.html" $ do
    route idRoute
    compile $ do
      posts <- loadAll "posts/*"
        >>= recentFirst
      let indexCtx = mempty
            <> listField "posts" postCtx (return posts)
            <> constField "title" "Home"
            <> myContext

      getResourceBody
        >>= applyAsTemplate indexCtx
        >>= loadAndApplyTemplate "templates/index.html" indexCtx
        >>= relativizeUrls

    match "templates/*" $ compile templateBodyCompiler


postCtx :: Context String
postCtx = mempty
  <> dateField "date" "%B %d, %Y"
  <> myContext

myContext :: Context String
myContext = mempty
  <> constField "baseUrl" "http://slee.xyz/"
  <> defaultContext

main :: IO ()
main = hakyll rules
