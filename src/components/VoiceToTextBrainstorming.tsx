
                    <Input
                        type="text"
                        id="altersgruppe"
                        placeholder="Gib die Altersgruppe ein"
                        value={altersgruppe}
                        onChange={(e) => setAltersgruppe(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="drinnenDraussen">Drinnen/Draußen</Label>
                    <Input
                        type="text"
                        id="drinnenDraussen"
                        placeholder="Gib Drinnen/Draußen ein"
                        value={drinnenDraussen}
                        onChange={(e) => setDrinnenDraussen(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="wetter">Wetter</Label>
                    <Input
                        type="text"
                        id="wetter"
                        placeholder="Gib das Wetter ein"
                        value={wetter}
                        onChange={(e) => setWetter(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="verfuegbareZeit">Verfügbare Zeit</Label>
                    <Input
                        type="text"
                        id="verfuegbareZeit"
                        placeholder="Gib die verfügbare Zeit ein"
                        value={verfuegbareZeit}
                        onChange={(e) => setVerfuegbareZeit(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="llmModell">LLM Modell</Label>
                    <Input
                        type="text"
                        id="llmModell"
                        placeholder="Gib das LLM Modell ein"
                        value={llmModell}
                        onChange={(e) => setLlmModell(e.target.value)}
                    />
                </div>
